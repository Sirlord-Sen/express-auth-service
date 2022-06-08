import ms from 'ms';
import Bull, { Job } from 'bull';
import { Service } from 'typedi'
import { EventEmitter } from 'events';

import { EmailService } from './';
import { EmailJob } from './email.types';
import { EmailConfig } from '@config//';
import { BullQueue } from '@lib/queue';
import { Logger } from '@utils/logger.util';
import { InternalServerError } from '@exceptions//';

@Service()
export default class EmailQueue extends BullQueue{  
    constructor() {
        super('EMAIL_QUEUQ', {
            defaultJobOptions: {
                attempts: 30,
                backoff: {
                    type: 'exponential',
                    delay: ms('1s')
                }
            }
        });
    
        this.process();
    }

    public addEmailToQueue(data: EmailJob, opt?: Bull.JobOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queue.add(data.name, data, opt)
                .then(job => {
                    Logger.info(`Job added for ${job.id}`)
                    resolve()
                })
                .catch(err => {
                    Logger.warn(`EMAIL_QUEUQ ${data.name}: ${err.message} for ${data.request.email}`)
                    reject(new InternalServerError(err.message))
                })

        })
    }

    private process() {
        const EventEmit = new EventEmitter()
        EventEmit.on('start', (): void => {
            this.queue.process(async (job: Job<EmailJob>) => {
                try {
                    const { email } = job.data.request
                    const {html, subject} = job.data.deploy
                    await EmailService.sendEmail({
                        to: email,
                        from: EmailConfig.username,
                        subject,
                        html
                    });

                    await job.progress(100)

                    return {status: 'completed'}
                }
                catch (err:any) {
                    Logger.error(`EMAIL_QUEUQ ${job.data.name} ${err.message} at ${err.response.config.url}`)
                    return Promise.reject(err);
                }
            })
        })
        EventEmit.emit('start')
    }

}
