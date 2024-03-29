import ms from 'ms';
import { Service } from 'typedi';
import { EventEmitter } from 'events';
import Bull, {QueueOptions, Queue} from 'bull';

import { Logger, LoggerInterface } from '@decorators/logger';
import { RedisConfig } from '@config/';

@Service()
export default class BullQueue{
    readonly queue: Queue;
    ee: EventEmitter
    queueConnectionAttemps : number
    MAX_CACHE_RETRY_ATTEMPTS: number

    constructor(
        @Logger(__dirname) public log: LoggerInterface,
        name: string,
        opts?: Pick<QueueOptions, 'limiter' | 'defaultJobOptions'>,
    ){
        this.queue = new Bull(name, {
            redis: {
                host: process.env.REDIS_HOST || RedisConfig.host,
                port: RedisConfig.port,
            },
            prefix: RedisConfig.queuePrefix,
            ...this.queueOptions,
            ...opts,
        });
        this.ee = new EventEmitter()
        this.queueConnectionAttemps = 0
        this.MAX_CACHE_RETRY_ATTEMPTS = 5
        this.start()
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

    private start() {
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
            this.log.warn(logMessage)
        })

        this.queue.on('completed', async (job, result) => {
            this.log.info(`Job ${job.id} has ${ result.status }`)
        })

        this.queue.on('error', async(error: ErrorEvent) => {
            this.log.error(`Bull Error: ${error}`)
        })

    }

    public async close (){
        await this.queue.close()
    }
}