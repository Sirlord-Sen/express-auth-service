import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'

class AppConfig{
    readonly port: number;
    readonly env: string;
  
    constructor(parsedEnv: ParsedVariables) {
      this.port = Number(parsedEnv.PORT)
      this.env = String(parsedEnv.NODE_ENV)
    }
  }
  
  export default new AppConfig(parsedEnv);