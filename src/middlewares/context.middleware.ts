import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class ContextMiddleware implements ExpressMiddlewareInterface{
    async use(req: Request, res: Response, next: (err?: any) => any) {
        const { useragent } = req
        req.ctx = {
            os: useragent?.os,
            browser: useragent?.browser
        }
        next()
    }
}
