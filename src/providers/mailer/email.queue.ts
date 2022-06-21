import ms from 'ms';
import Bull, { Job } from 'bull';
import { Service } from 'typedi'
import { EventEmitter } from 'events';

import { EmailService } from './';
import { EmailJob, QueueName } from './email.types';
import { EmailConfig } from '@config/';
import { BullQueue } from '@lib/queue';
import { InternalServerError } from '@exceptions/';
import { Logger } from '@lib/logger';

@Service()
export default class EmailQueue extends BullQueue{  
    private eventEmit: EventEmitter;
    public static queue_name: string;

    constructor(){
        super(new Logger(__dirname),'EMAIL_QUEUQ', {
            defaultJobOptions: {
                attempts: 30,
                backoff: {
                    type: 'exponential',
                    delay: ms('1s')
                }
            }
        });
        this.eventEmit = new EventEmitter();
        this.process();
    }

    public addEmailToQueue(data: EmailJob, opt?: Bull.JobOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.queue.add(EmailQueue.queue_name, data, opt)
                .then(job => {
                    this.log.info(`Job added for ${job.id}`)
                    resolve()
                })
                .catch(err => {
                    this.log.warn(`EMAIL_QUEUQ ${EmailQueue.queue_name}: ${err.message} for ${data.request.email}`)
                    reject(new InternalServerError(err.message))
                })

        })
    }

    private process() {   
        this.eventEmit.on('start', (): void => {
            this.queue.process(QueueName.CONFIRMACCOUNT, async (job: Job<EmailJob>) => { return await this.jobHandler(job) })
            this.queue.process(QueueName.RESETPASSWORD, async (job: Job<EmailJob>) => { return await this.jobHandler(job) }) 
        })
        this.eventEmit.emit('start')
    }

    private async jobHandler(job: Job<EmailJob>){
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

            return { status : 'completed' }
        }
        catch (err:any) {
            this.log.error(`EMAIL_QUEUQ ${EmailQueue.queue_name} ${err.message} at ${err.response.config.url}`)
            return Promise.reject(err);
        }
    }

}
