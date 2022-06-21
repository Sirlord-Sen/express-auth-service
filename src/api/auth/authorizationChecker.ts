import { Container } from 'typedi';
import { Connection } from 'typeorm';
import { Action } from 'routing-controllers';
import { VerifyOptions, JwtPayload } from 'jsonwebtoken';

import { JwtConfig } from '@config/';
import { TokenHelper } from '@helpers/';
import { JWTService } from '@providers/jwt';
import { Logger } from '@lib/logger';
import { TokensCache } from '@providers/cache';
import { UnauthorizedError } from '@exceptions/';


export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const log = new Logger(__dirname);

    const jwtService = Container.get<JWTService>(JWTService);
    const tokensCache = TokensCache

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
        
        const accessToken = TokenHelper.getTokenFromHeader(action.request.headers)

        if(!accessToken) {
            log.warn('No token provided')
            return false
        }

        try {
            const userId = await tokensCache.getProp(accessToken)
            if (userId) {
                action.request.currentUser = { 
                    userId: userId,
                }
                return true;
            }
            const publicKey = JwtConfig.publicAccessKey

            const verifyOptions: VerifyOptions = {
                algorithms: ['RS256']
            }

            const data = await jwtService.verifyAsync<JwtPayload>(
                accessToken,
                publicKey,
                verifyOptions
            );
            const exp = data.exp as number

            const expireAfter = exp - Math.round((new Date()).valueOf() / 1000)
    
            await tokensCache.setProp(accessToken, data.userId, expireAfter)

            action.request.currentUser = {
                userId: data.userId,
                // email: data.email
            };

            return true;
        } 
        catch (err: any) { throw new UnauthorizedError(err.message) }
    };
}