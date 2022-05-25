import { 
  Middleware, 
  ExpressErrorMiddlewareInterface
} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express'
import { BadRequestError, InternalServerError, UnauthorizedError } from '@exceptions//'
import { ValidationError } from 'class-validator'
import { Service } from 'typedi'
import { Logger } from '@utils/logger.util';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    async error(error: any, request: Request, response: Response, next:NextFunction) {
      console.log(error)
        if(error.errors && error.errors[0] instanceof ValidationError){
            let message = ''
            for(const i in error.errors[0].constraints){
                message = error.errors[0].constraints[i]
            }

            response.json(new BadRequestError(message))
        }
        if(error.error) response.json(error)
        else {
          Logger.error(error)
          response.json(new UnauthorizedError()) 
      }
        return next();
  }
}