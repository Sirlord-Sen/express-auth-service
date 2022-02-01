class RedisConfig {
  readonly host: string;
  readonly password: string;
  readonly port: number;
  readonly queuePrefix: string;
  readonly time: number;

  constructor() {
    this.port = Number(process.env.REDIS_PORT)
    this.host = String(process.env.REDIS_HOST)
    this.password = String(process.env.REDIS_PASSWORD)
    this.time = Number(process.env.REDIS_TIME)
    this.queuePrefix = String(process.env.QUEUE_PREFIX)
  }
}

export default new RedisConfig();