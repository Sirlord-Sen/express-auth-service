import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class OAuthConfig{
    readonly clientId: string;
    readonly clientSecret: string;
    readonly refreshToken: string;
  
    constructor(parsedEnv: ParsedVariables) {
  
      this.clientId = String(parsedEnv.OAUTH_CLIENTID)
      this.clientSecret = String(parsedEnv.OAUTH_CLIENT_SECRET)
      this.refreshToken = String(parsedEnv.OAUTH_REFRESH_TOKEN)
    }
  }
  
  export default new OAuthConfig(parsedEnv);