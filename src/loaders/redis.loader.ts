import { AppConfig, RedisConfig } from '@config//'
import { Logger } from '@utils/logger.util'
import r from 'ioredis'
import { Redis } from 'ioredis'
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';


const redis : typeof r = RedisConfig.url === 'redis-mock' ? require('ioredis-mock') : require('ioredis')

export class RedisApplication{
    public client: Redis
    initialConnection: boolean

    constructor(){
        this.initialConnection = true  
        this.client =  this.createClient()
    }

    private get defaultOptions(){
        return {
            maxRetriesPerRequest : 20,
            retryStrategy(times:number){
                const delay = Math.min(times * 50, 2000)
                if (times >= this.maxRetriesPerRequest) return null
                return delay
            }
        }
    }

    public createClient(){
        return this.client = new redis({
            host: RedisConfig.host,
            port: RedisConfig.port,
            ...this.defaultOptions,
        })
    }

    public async start(): Promise<void>{
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
            this.client.on('error', (err) => {
                Logger.error(`Redis: ${err}`)
            })

        })
    }


    public async close():Promise<void> {
        await this.client.quit() 
        return
    }
}

export const redisLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {

        const redisApp: RedisApplication = new RedisApplication()

        // Run application to listen on given port
        if (AppConfig.env !== 'test') {
            const server = redisApp.start()
            settings.setData('redis_server', server);
        }

        settings.onShutdown(() => redisApp.close());
    }
};