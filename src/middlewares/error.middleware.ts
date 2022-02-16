import { 
  Middleware, 
  ExpressErrorMiddlewareInterface
} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '@utils/error-response.util'
import { ValidationError } from 'class-validator'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    async error(error: any, request: Request, response: Response, next:NextFunction) {
        if(error.errors && error.errors[0] instanceof ValidationError){
            let message: string = ''
            for(let i in error.errors[0].constraints){
                message = error.errors[0].constraints[i]
            }

            response.json(new BadRequestError(message).send())
        }
        if(error.program) response.json(error)
    
        return next();
  }
}