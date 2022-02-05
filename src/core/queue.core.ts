import Bull, {QueueOptions, Queue} from 'bull';
import ms from 'ms';
import { Logger } from '@utils/logger.util';
import { RedisConfig } from '@config//';


export default class QueueCore {
    readonly queue: Queue;

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

        this.eventError();
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

    private async eventError() {
        this.queue.on('error', error => {
            Logger.error(error)
        });
        // await this.queue.close();
    }
}