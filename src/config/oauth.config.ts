import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class OAuthConfig{
    readonly googleClientId: string;
    readonly googleClientSecret: string;
    readonly googleRefreshToken: string;
    readonly googleRedirectUrl: string;
    readonly facebookClientId: string;
    readonly facebookClientSecret: string;
    readonly facebookRedirectUrl: string
  
    constructor(parsedEnv: ParsedVariables) {
  
      this.googleClientId = String(parsedEnv.GOOGLE_OAUTH_CLIENTID)
      this.googleClientSecret = String(parsedEnv.GOOGLE_OAUTH_CLIENT_SECRET)
      this.googleRefreshToken = String(parsedEnv.GOOGLE_OAUTH_REFRESH_TOKEN)
      this.googleRedirectUrl = String(parsedEnv.GOOGLE_OAUTH_REDIRECT_URL)
      this.facebookClientId = String(parsedEnv.FACEBOOK_OAUTH_CLIENTID)
      this.facebookClientSecret = String(parsedEnv.FACEBOOK_OAUTH_CLIENT_SECRET)
      this.facebookRedirectUrl = String(parsedEnv.FACEBOOK_OAUTH_REDIRECT_URL)
    }
  }
  
  export default new OAuthConfig(parsedEnv);