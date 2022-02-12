import { RedisConfig } from '@config//'
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
        this.listeners()
        this.errorListener()
    }

    private get defaultOptions(){
        return {
            maxRetriesPerRequest : 20
        }
    }

    public async listeners(): Promise<void>{
        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                Logger.info('Redis: connected')
            })
            this.client.on('ready', () => {
                if(this.initialConnection){
                    this.initialConnection = false
                    resolve()
                }
                Logger.info('Redis: ready')
            })
            this.client.on('reconnecting', () => {
                Logger.info('Redis: reconnecting')
            })
            this.client.on('end', () => {
                Logger.info('Redis: end')
            })
            this.client.on('disconnected', () => {
                Logger.error('Redis: disconnected')
            })

        })
    }


    public async close():Promise<void> {
        await this.client.quit() 
        return
    }


    private async errorListener(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.on('error', function(err) {
                Logger.error(`Redis: ${err}`)
            })
        })
    } 
}