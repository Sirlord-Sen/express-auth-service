import { ExpressMiddlewareInterface } from 'routing-controllers';
import { TokenHelper } from '@helpers//';
import { Request, Response } from 'express';
import JWTService from '@providers/jwt/jwt.service';
import { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwtConfig } from '@config//';
import { ForbiddenError } from '@utils/error-response.util';
import TokensCache from '@utils/cache.util';

export class AuthMiddleware implements ExpressMiddlewareInterface{
    private readonly jwtService: JWTService
    private tokensCache: TokensCache

    constructor(){
      this.jwtService = new JWTService()
      this.tokensCache = new TokensCache()
    }
    
    async use(req: any, res: Response, next: (err?: any) => any) {
        const accessToken = TokenHelper.getTokenFromHeader(req.headers)

        if(accessToken) {
            try {
                const userId = await this.tokensCache.getProp(accessToken)
                if (userId) {
                    req.currentUser = { 
                        userId: userId,
                        email: "lodwaf12@gmail.com"
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

                console.log(data.exp)
                // await this.tokensCache.setProp(accessToken, data.userId, data.exp)
                req.currentUser = {
                    userId: data.userId,
                    email: data.email
                };

                return next();
            } 
            catch (err) { return next(err) }
        }

        return next( new ForbiddenError().send() )
    }
}
