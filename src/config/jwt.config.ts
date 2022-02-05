import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class JwtConfig{
    readonly accessTokenSecret: string;
    readonly accessTokenExpiration: string;
    readonly refreshTokenSecret: string;
    readonly refreshTokenExpiration: string;
  
    constructor(parsedEnv: ParsedVariables) {
  
      this.accessTokenSecret = String(parsedEnv.ACCESS_TOKEN_SECRET)
      this.accessTokenExpiration = String(parsedEnv.ACCESS_TOKEN_EXPIRATION)
      this.refreshTokenSecret = String(parsedEnv.REFRESH_TOKEN_SECRET)
      this.refreshTokenExpiration = String(parsedEnv.REFRESH_TOKEN_EXPIRATION)
    }
  }
  
  export default new JwtConfig(parsedEnv);