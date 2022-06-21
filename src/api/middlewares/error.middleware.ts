import { Service } from 'typedi'
import { ValidationError } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

import { Logger } from '@lib/logger';
import { BadRequestError, UnauthorizedError } from '@exceptions/'

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    private log = new Logger(__dirname);

    async error(error: any, request: Request, response: Response, next:NextFunction) {
        if(error.errors && error.errors[0] instanceof ValidationError){
            let message = ''
            for(const i in error.errors[0].constraints){
                message = error.errors[0].constraints[i]
            }

            response.json(new BadRequestError(message))
            return next();
        }
        if(error.error) {
            response.json(error)
            return next()
        }
        this.log.error(error)
        response.json(new UnauthorizedError()) 
        
        return next();
  }
}