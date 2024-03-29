import { parsedEnv } from ".";
import { ParsedVariables } from 'dotenv-parse-variables'
import { RedisOptions } from 'ioredis'

class RedisConfig implements RedisOptions{
  readonly host: string;
  readonly port: number;
  readonly queuePrefix: string;
  readonly url: string
  // readonly password: string;
  // readonly time: number;

  constructor(parsedEnv:ParsedVariables) {
    this.host = String(parsedEnv.REDIS_HOST)
    this.port = Number(parsedEnv.REDIS_PORT) 
    this.queuePrefix = String(parsedEnv.QUEUE_PREFIX) 
    this.url = String(parsedEnv.REDIS_URL)
    // this.password = String(parsedEnv.REDIS_PASSWORD)
    // this.time = Number(parsedEnv.REDIS_TIME)
  }
}

export default new RedisConfig(parsedEnv);