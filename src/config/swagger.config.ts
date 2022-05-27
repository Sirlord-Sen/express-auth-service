import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class SwaggerConfig{
    readonly enabled: boolean;
    readonly username: string;
    readonly route: string;
    readonly password: string;
  
    constructor(parsedEnv: ParsedVariables) {
      this.enabled = Boolean(parsedEnv.SWAGGER_ENABLED)
      this.username = String(parsedEnv.SWAGGER_USERNAME);
      this.route = String(parsedEnv.SWAGGER_ROUTE)
      this.password = String(parsedEnv.SWAGGER_PASSWORD)
    }
  }
  
  export default new SwaggerConfig(parsedEnv);