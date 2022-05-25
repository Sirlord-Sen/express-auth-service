import morgan from 'morgan'
import { Service } from 'typedi';
import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

import { Logger }  from '@utils/logger.util'


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