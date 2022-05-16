import passport from "passport";
import { GoogleStrategy } from "@providers/passport/google.passport";
import { FacebookStrategy } from "./facebook.passport";

passport.use('google', GoogleStrategy)
passport.use('facebook', FacebookStrategy)

export default passport