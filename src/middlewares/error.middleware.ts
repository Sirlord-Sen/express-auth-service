import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { BadRequestError } from '../utils/error-response.util'
import { ValidationError } from 'class-validator'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  async error(error: any, request: any, response: any, next:any) {
    if(error.errors[0] && error.errors[0] instanceof ValidationError){
        let message: string = ''
        for(let i in error.errors[0].constraints){
            message = error.errors[0].constraints[i]
        }
        response.json(new BadRequestError(message).send())
    }
    else{ response.json(new BadRequestError(error.message).send()) }
    next();
  }
}
