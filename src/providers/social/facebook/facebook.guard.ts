import passport from "passport";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class FacebookGuard implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: (err?: any) => any) {
        await passport.authenticate("facebook", { scope: ["user_friends", "public_profile"], session: false })(req, res, next);
    }
}