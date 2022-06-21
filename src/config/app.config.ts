import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'
import * as pkg from '../../package.json';

class AppConfig{
    readonly port: number;
    readonly env: string;
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly schema: string;
    readonly host: string;
    readonly routePrefix: string;
    readonly banner: boolean;
  
    constructor(parsedEnv: ParsedVariables) {
      this.port = Number(parsedEnv.APP_PORT);
      this.env = String(parsedEnv.NODE_ENV);
      this.version = (pkg as any).version;
      this.description= (pkg as any).description;
      this.name = String(parsedEnv.APP_NAME)
      this.schema = String(parsedEnv.APP_SCHEMA);
      this.host = String(parsedEnv.APP_HOST);
      this.routePrefix = String(parsedEnv.APP_ROUTE_PREFIX);
      this.banner = Boolean(parsedEnv.APP_BANNER)
    }
  }
  
  export default new AppConfig(parsedEnv);