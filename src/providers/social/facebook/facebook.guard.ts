import passport from "passport";
import { Service } from "typedi";
import { ExpressMiddlewareInterface } from "routing-controllers";

@Service()
export default class FacebookGuard implements ExpressMiddlewareInterface {
    async use(req: Request, res: Response, next: (err?: any) => any) {
        await passport.authenticate("facebook", { scope: ["user_friends", "public_profile"], session: false })(req, res, next);
    }
}