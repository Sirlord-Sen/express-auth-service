import Bull, {QueueOptions, Queue} from 'bull';
import ms from 'ms';
import { EventEmitter } from 'events';
import { Logger } from '../utils/logger.util';
import { RedisConfig } from '../config';

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
                password: RedisConfig.password,
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

    private eventError() {
        const EventEmit = new EventEmitter()
        this.queue.on('error', log => {
            Logger.error(log)
        });
        EventEmit.once('close', async () => {
            await this.queue.close();
        });
    }
}