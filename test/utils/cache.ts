import redis from 'ioredis-mock'
import { Redis } from 'ioredis-mock'

import { RedisConfig } from '../../src/config'

const defaultOptions = () => {
    return {
        maxRetriesPerRequest : 20,
        retryStrategy(times:number){
            const delay = Math.min(times * 50, 2000)
            if (times >= this.maxRetriesPerRequest) return null
            return delay
        }
    }
}

export const createRedisConnection = async (): Promise<Redis> => {
    const client =  new redis({
        host: RedisConfig.host,
        port: RedisConfig.port,
        ...defaultOptions()
    })

    return client;
};

export const closeRedis =async (client: Redis): Promise<string> => {
    return await client.quit() 
}