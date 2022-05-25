import passport from "passport";
import { Service } from "typedi";
import { ExpressMiddlewareInterface } from "routing-controllers";

@Service()
export default class GoogleGuard implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: (err?: any) => any) {
        await passport.authenticate("google", { scope: ["email", "profile"], session: false })(req, res, next);
    }
}