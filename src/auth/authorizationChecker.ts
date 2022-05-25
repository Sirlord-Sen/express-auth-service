import { JwtConfig } from '@config//';
import UnauthorizedError from '@exceptions/UnauthorizedError';
import { TokenHelper } from '@helpers//';
import { TokensCache } from '@providers/cache';
import { JWTService } from '@providers/jwt';
import { Logger } from '@utils/logger.util';
import { VerifyOptions, JwtPayload } from 'jsonwebtoken';
import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const log = Logger
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