import Bull, {Job} from 'bull';
import ms from 'ms';
import EmailService from './email.service';
import { EmailJob } from './email.types';
import { Logger } from '@utils/logger.util';
import { EmailConfig } from '@config//';
import { EventEmitter } from 'events';
import QueueCore from '@core/queue.core';
import { InternalServerError } from '@utils/error-response.util';
import { Service } from 'typedi'

@Service()
export default class EmailQueue extends QueueCore{  
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
            this.queue.add('EMAIL_FORGOT_PASSWORD', data, opt)
                .then(job => {
                    Logger.info(`Job added for ${job.id}`)
                    resolve()
                })
                .catch(err => {
                    Logger.warn(`EMAIL_QUEUQ EMAIL_FORGOT_PASSWORD: ${err.message} for ${data.request.email}`)
                    reject(new InternalServerError(err.message))
                })

        })
    }

    private process() {
        const EventEmit = new EventEmitter()
        EventEmit.on('start', (): void => {
            this.queue.process('EMAIL_FORGOT_PASSWORD', async (job: Job<EmailJob>) => {
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
                    Logger.error(`EMAIL_QUEUQ EMAIL_FORGOT_PASSWORD ${err.message} at ${err.response.config.url}`)
                    return Promise.reject(err);
                }
            })
        })
        EventEmit.emit('start')
    }

}
