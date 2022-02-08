import { RedisConfig } from '@config//'
import { Logger } from '@utils/logger.util'
import * as r from 'redis'
import { RedisClientOptions, RedisClientType } from 'redis'


const redis : typeof r = RedisConfig.redisUrl === 'redis-mock' ? require('redis-mock') : require('redis')

export default class CacheCore{
    
    readonly client:RedisClientType<{}>
    initialConnection: boolean

    constructor(opts: RedisClientOptions){
        this.client = redis.createClient(opts)
        this.initialConnection = true
        this.client.connect()      
        this.eventError()      
    }


    public close(): Promise<void> {
        return new Promise((resolve) => {
            this.client.quit()
        })  
    }

    private async eventError() {
        this.client.on('error', error => {
            Logger.error(error)
        });
    } 
}