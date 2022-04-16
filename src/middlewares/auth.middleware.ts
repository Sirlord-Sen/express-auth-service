import { ExpressMiddlewareInterface } from 'routing-controllers';
import { TokenHelper } from '@helpers//';
import { Request, Response } from 'express';
import JWTService from '@providers/jwt/jwt.service';
import { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwtConfig } from '@config//';
import { BadRequestError, ForbiddenError } from '@utils/error-response.util';
import TokensCache from '@utils/cache.util';
import { Service } from 'typedi'

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface{
    private readonly jwtService: JWTService
    private tokensCache

    constructor(){
      this.jwtService = new JWTService()
      this.tokensCache = TokensCache
    }
    
    async use(req: Request, res: Response, next: (err?: any) => any) {
        const accessToken = TokenHelper.getTokenFromHeader(req.headers)

        if(accessToken) {
            try {
                const userId = await this.tokensCache.getProp(accessToken)
                if (userId) {
                    req.currentUser = { 
                        userId: userId,
                    }
                    return next()
                }
                const publicKey = JwtConfig.publicAccessKey

                const verifyOptions: VerifyOptions = {
                    algorithms: ['RS256']
                }

                const data = await this.jwtService.verifyAsync<JwtPayload>(
                    accessToken,
                    publicKey,
                    verifyOptions
                );
                const exp = data.exp as number

                const expireAfter = exp - Math.round((new Date()).valueOf() / 1000)
        
                await this.tokensCache.setProp(accessToken, data.userId, expireAfter)

                req.currentUser = {
                    userId: data.userId,
                    // email: data.email
                };

                return next();
            } 
            catch (err) { return next(err) }
        }

        return next( new ForbiddenError() )
    }
}
