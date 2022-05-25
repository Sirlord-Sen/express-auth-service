import passport from "passport";
import { GoogleStrategy } from "./google/google.strategy";
import { FacebookStrategy } from "./facebook/facebook.strategy";

passport.use('google', GoogleStrategy)
passport.use('facebook', FacebookStrategy)

export default passport