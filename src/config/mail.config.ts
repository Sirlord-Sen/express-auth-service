import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'


class EmailConfig{
  readonly username: string;

  constructor(parsedEnv: ParsedVariables) {
    this.username = String(parsedEnv.MAIL_USERNAME)
  }
}

export default new EmailConfig(parsedEnv);