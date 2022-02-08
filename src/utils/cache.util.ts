import { RedisConfig } from "@config//";
import CacheCore from "@core/cache.core";
import { RedisClientOptions } from "redis";
import { Logger } from "./logger.util";

export default class AppCache extends CacheCore{  
    constructor() {
        super({ 
            url: RedisConfig.url
        })
        this.open()
    }

    public async open(): Promise<void>{
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
        
}
