import Bull, {QueueOptions, Queue} from 'bull';
import ms from 'ms';
import { Logger } from '@utils/logger.util';
import { RedisConfig } from '@config//';
import { InternalError } from '@utils/error-response.util';
import { CodeError } from '@utils/util-types' 
import { EventEmitter } from 'events';


export default class QueueCore {
    readonly queue: Queue;
    ee: EventEmitter
    queueConnectionAttemps : number
    MAX_CACHE_RETRY_ATTEMPTS: number

    constructor(
        name: string,
        opts?: Pick<QueueOptions, 'limiter' | 'defaultJobOptions'>,
    ){
        this.queue = new Bull(name, {
            redis: {
                port: RedisConfig.port,
                host: RedisConfig.host,
                // password: RedisConfig.password,
            },
            prefix: RedisConfig.queuePrefix,
            ...this.queueOptions,
            ...opts,
        });
        this.ee = new EventEmitter()
        this.queueConnectionAttemps = 0
        this.MAX_CACHE_RETRY_ATTEMPTS = 5
        this.ee.emit('something')
        this.eventError()
    }

    private get queueOptions() {
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


    private async eventError(): Promise<any> {
        this.queue.on('error', async(error: CodeError) => {
            if(this.queueConnectionAttemps >= this.MAX_CACHE_RETRY_ATTEMPTS){
                Logger.error("Could not connect. Killing process")
                process.exit(1)  
            }
            Logger.error(error)
            this.queueConnectionAttemps ++
        })
    }
}