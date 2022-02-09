import CacheCore from "@core/cache.core";
import { InternalError } from "./error-response.util";
import { Logger } from "./logger.util";

export default class TokensCache extends CacheCore{  
    constructor() {
        super({ 
            maxRetriesPerRequest: 1,
            retryStrategy(times){
                const delay = Math.min(times * 50, 2000)
                if (times >= 20) return null
                return delay
            }
        })
        this.process()
    }

    public async process(): Promise<void>{
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

    public async setProp(key: string, value: string, expireAfter: number): Promise<void> {
        try{ 
            await this.client!.setex(key, expireAfter, value) 
            Logger.info(`Token Cache added for User: ${value}`)
        }
        catch(err:any) { 
            Logger.error('TOKEN_ERROR:', err)
            throw new InternalError(err.message).send() 
        } 
    }

    public async getProp(key: string): Promise<string| undefined> {
        try{ 
            const result = await this.client!.get(key)
            return result ? result : undefined
        }
        catch(err:any){
            Logger.error('TOKEN_ERROR:', err)
            throw new InternalError(err.message).send()
        }
      
    }
    
    // public async getProp(key: string): Promise<string|undefined> {
    //     return new Promise((resolve, reject) => {
    //         const result = this.client!.get(key, function(error, result) {
    //             if (error) return reject(error)
    //             resolve(result ? result : undefined)
    //         })
    //         if (result !== undefined && result === false) {
    //             reject(new Error('Redis connection error'))
    //         }
    //     })
    // }
        
}
