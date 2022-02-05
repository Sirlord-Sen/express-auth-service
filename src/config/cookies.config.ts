import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'
import { CookieOptions } from "express";

class CookiesConfig implements CookieOptions{
    readonly httpOnly: boolean;
    readonly secure: boolean;
  
    constructor(parsedEnv: ParsedVariables) {
        this.httpOnly = Boolean(parsedEnv.HTTPONLY)
        this.secure =  Boolean(parsedEnv.SECURE)
    }
  }
  
  export default new CookiesConfig(parsedEnv);