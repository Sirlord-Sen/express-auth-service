import { ExpressMiddlewareInterface } from 'routing-controllers';
import { TokenHelper } from '@helpers//';
import { Request, Response } from 'express';
import JWTService from '@providers/jwt/jwt.service';
import { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { JwtConfig } from '@config//';
import { ForbiddenError } from '@utils/error-response.util';

export class AuthMiddleware implements ExpressMiddlewareInterface{
    private readonly jwtService: JWTService

    constructor(){
      this.jwtService = new JWTService()
    }
    
    async use(req: any, res: Response, next: (err?: any) => any) {
        const accessToken = TokenHelper.getTokenFromHeader(req.headers)

        if(accessToken) {
            try {
                const publicKey = JwtConfig.publicAccessKey
                const verifyOptions: VerifyOptions = {
                    algorithms: ['RS256']
                  }
                const data = await this.jwtService.verifyAsync<JwtPayload>(
                    accessToken,
                    publicKey,
                    verifyOptions
                );
                
                req.currentUser = {
                  userId: data.userId,
                  email: data.email
                };

                return next();
            } catch (err) {   
                return next(err);
            }
        }

        return next( new ForbiddenError().send() )
    }
}
