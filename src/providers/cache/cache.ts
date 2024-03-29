import { Service } from 'typedi'

import { RedisApplication } from "@loaders/redis.loader";

@Service()
export class TokensCache extends RedisApplication{  
    private static _instance: TokensCache
    
    public static getInstance(): TokensCache {
        if (!TokensCache._instance) {
          TokensCache._instance = new TokensCache(__filename)
        }
        return TokensCache._instance
    }


    public setProp(key: string, value: string, expireAfter: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client!.setex(key, expireAfter, value, (error, res) => {
                if (error) {
                    this.log.warn(`${error.name}:: ${error.message}`)
                    return resolve()
                }
                this.log.info(`Token Cache added for User: ${value}`)
                return resolve()
            })
        })
    }

    
    public async getProp(key: string): Promise<string|undefined> {
        return new Promise((resolve, reject) => {
            this.client!.get(key, (error, result) => {
                if (error){
                    this.log.warn(`${error.name}:: ${error.message}`)
                }
                return resolve(result ? result : undefined)
            })
    
        })
    }
        
}

export default TokensCache.getInstance()
