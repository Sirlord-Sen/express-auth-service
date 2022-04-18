import Bull, {QueueOptions, Queue} from 'bull';
import ms from 'ms';
import { Logger } from '@utils/logger.util';
import { RedisConfig } from '@config//';
import { CodeError } from '@utils/utility-types' 
import { EventEmitter } from 'events';

import Redis from 'ioredis';
import CacheCore from './cache.core';



export default class QueueCore{
    readonly queue: Queue;
    ee: EventEmitter
    queueConnectionAttemps : number
    MAX_CACHE_RETRY_ATTEMPTS: number

    constructor(
        name: string,
        opts?: Pick<QueueOptions, 'limiter' | 'defaultJobOptions'>,
    ){
        // super({ 
        //     maxRetriesPerRequest: 20,
        //     retryStrategy(times){
        //         const delay = Math.min(times * 50, 2000)
        //         if (times >= 20) return null
        //         return delay
        //     }
        // })
        this.queue = new Bull(name, {
            redis: {
                port: RedisConfig.port,
                host: RedisConfig.host,
                // password: RedisConfig.password,
            },
            prefix: RedisConfig.queuePrefix,
            // ...this.RedisConnection,
            ...this.queueOptions,
            ...opts,
        });
        this.ee = new EventEmitter()
        this.queueConnectionAttemps = 0
        this.MAX_CACHE_RETRY_ATTEMPTS = 5
        this.bullListeners()
        this.bullErrorListener()
    }

    private get queueOptions(): QueueOptions {
        return {
            limiter: { max: 30, duration: ms('5s') },
            defaultJobOptions: {
                attempts: 30,
                backoff: {
                    type: 'fixed',
                    delay: ms('1m')
                }
            }
        };
    }

    // private get RedisConnection():QueueOptions {
    //     const client = new Redis({
    //         host: RedisConfig.host,
    //         port: RedisConfig.port});
    //     const subscriber = new Redis({
    //         host: RedisConfig.host,
    //         port: RedisConfig.port,});
    //     const _client = this.client
    //     return{
    //         createClient(type:any): Redis.Redis {
    //             switch (type) {
    //                 // case 'client': return client;
    //                 // case 'subscriber': return subscriber;

    //                 default: return _client
    //             }
    //         },
    //     };
    // }

    private bullListeners() {
        this.queue.on('failed',async (job, error) => {
            const { name, id, data, attemptsMade, finishedOn, failedReason } = job
            const { message } = error
            const logMessage = `
            ------------
            JOB FAILED
            name: ${name}
            id: ${id}
            data: ${JSON.stringify(data)}
            attemptsMade: ${attemptsMade}
            failedReason: ${failedReason}
            Error: ${message}
            finishedOn: ${finishedOn}
            -------------
          `
          Logger.warn(logMessage)
        })

        this.queue.on('completed', async (job, result) => {
            Logger.info(`Job ${job.id} has ${ result.status }`)
        })

    }

    private async bullErrorListener(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queue.on('error', async(error: CodeError) => {
                Logger.error(`Redis: ${error}`)
            })
        })
    }
}