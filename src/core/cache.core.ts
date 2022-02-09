import { RedisConfig } from '@config//'
import { InternalError } from '@utils/error-response.util'
import { Logger } from '@utils/logger.util'
import r from 'ioredis'
import { RedisOptions, Redis } from 'ioredis'


const redis : typeof r = RedisConfig.url === 'redis-mock' ? require('ioredis-mock') : require('ioredis')

export default class CacheCore{
    
    readonly client: Redis
    initialConnection: boolean

    constructor(opts?: RedisOptions){
        this.client = new redis({
            host: RedisConfig.host,
            port: RedisConfig.port,
            ...this.defaultOptions,
            ...opts
        })
        this.initialConnection = true  
        this.eventError()
    }

    private get defaultOptions(){
        return {
            maxRetriesPerRequest : 20
        }
    }

    public async close():Promise<void> {
        await this.client.quit() 
        return
    }

    private async eventError() {
        this.client.on('error', error => {
            Logger.error(error.message)
        });
    } 
}