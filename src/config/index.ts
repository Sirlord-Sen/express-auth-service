import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables, { ParsedVariables } from 'dotenv-parse-variables'
 
const env = dotenvExtended.load({
  path: process.env.ENV_FILE,
  defaults: './config/.env.defaults',
  schema: './config/.env.schema',
  includeProcessEnv: true,
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true
})

export const parsedEnv: ParsedVariables = dotenvParseVariables(env)

export { default as DBConfig } from './db.config'
export { default as CookiesConfig } from './cookies.config'
export { default as EmailConfig } from './mail.config'
export { default as OAuthConfig } from './oauth.config';
export { default as JwtConfig } from './jwt.config';
export { default as RedisConfig } from './redis.config';
export { default as AppConfig } from './app.config';