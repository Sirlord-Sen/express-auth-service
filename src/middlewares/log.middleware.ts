import morgan from 'morgan'
import { Logger }  from '@utils/logger.util'
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {

    private log = Logger;

    public use(req: Request, res: Response, next: NextFunction): any {
        const skip = () => {
            const env = process.env.NODE_ENV || "development";
            return env !== "development";
        };
        return morgan("short", {
            stream: {
                write: (message) => this.log.http(message),
            },
            skip
        })(req, res, next);
    }

}