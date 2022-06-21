import morgan from 'morgan'
import { Service } from 'typedi';
import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Logger } from '@lib/logger';
import { AppConfig } from '@config/';



@Service()
@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {

    private log = new Logger(__dirname);

    public use(req: Request, res: Response, next: NextFunction): any {
        const skip = () => { return AppConfig.env === "development" ? false : true; };

        return morgan('dev', {
            stream: { write: this.log.http.bind(this.log) },
            skip
        })(req, res, next);
    }
}