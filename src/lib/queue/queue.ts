import Bull, {QueueOptions, Queue} from 'bull';
import ms from 'ms';
import { Logger } from '@utils/logger.util';
import { RedisConfig } from '@config//';
import { CodeError } from '@utils/utility-types' 
import { EventEmitter } from 'events';


export default class BullQueue{
    readonly queue: Queue;
    ee: EventEmitter
    queueConnectionAttemps : number
    MAX_CACHE_RETRY_ATTEMPTS: number

    constructor(
        name: string,
        opts?: Pick<QueueOptions, 'limiter' | 'defaultJobOptions'>,
    ){
        this.queue = new Bull(name, {
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
          Logger.warn(logMessage)
        })

        this.queue.on('completed', async (job, result) => {
            Logger.info(`Job ${job.id} has ${ result.status }`)
        })

        this.queue.on('error', async(error: CodeError) => {
            Logger.error(`Bull Error: ${error}`)
        })

    }
}