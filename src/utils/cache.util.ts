import CacheCore from "@core/cache.core";
import { Logger } from "./logger.util";
import { Service } from 'typedi'

@Service()
class TokensCache extends CacheCore{  
    private static _instance: TokensCache
    constructor(){
        super({ 
            maxRetriesPerRequest: 20,
            retryStrategy(times){
                const delay = Math.min(times * 50, 2000)
                if (times >= 20) return null
                return delay
            }
        })
    }
    
    public static getInstance(): TokensCache {
        if (!TokensCache._instance) {
          TokensCache._instance = new TokensCache()
        }
        return TokensCache._instance
    }


    public setProp(key: string, value: string, expireAfter: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client!.setex(key, expireAfter, value, (error, res) => {
                if (error) {
                    Logger.warn(`${error.name}:: ${error.message}`)
                    return resolve()
                }
                Logger.info(`Token Cache added for User: ${value}`)
                return resolve()
            })
        })
    }

    
    public async getProp(key: string): Promise<string|undefined> {
        return new Promise((resolve, reject) => {
            this.client!.get(key, (error, result) => {
                if (error){
                    console.log('asdasds')
                    Logger.warn(`${error.name}:: ${error.message}`)
                }
                return resolve(result ? result : undefined)
            })
    
        })
    }
        
}

export default TokensCache.getInstance()
