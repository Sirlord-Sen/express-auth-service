import Bull, {Job} from 'bull';
import ms from 'ms';
import EmailService from './email.service';
import { ForgotPassword } from './email.types';
import { Logger } from '../../utils/logger.util';
import { EmailConfig } from '../../config';
import { EventEmitter } from 'events';
import QueueCore from '../../core/queue.core';

class EmailQueue extends QueueCore{  
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

    addForgotPasswordToQueue(data: ForgotPassword, opt?: Bull.JobOptions) {
        void this.queue.add('EMAIL_FORGOT_PASSWORD', data, opt);
    }

    private process() {
        const EventEmit = new EventEmitter()
        EventEmit.once('start', () => {
            void this.queue.process(
                'EMAIL_FORGOT_PASSWORD',
                async (job: Job<ForgotPassword>) => {
                    try {
                        const { email, token } = job.data;

                        await EmailService.sendEmail({
                            to: email,
                            from: EmailConfig.username,
                            subject: 'Forgot password',
                            text: 'Forgot password',
                            html: `Token: ${token}`,
                        });

                        await job.progress(100);

                        return await Promise.resolve();
                    }catch (err) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        Logger.error(`EMAIL_QUEUQ EMAIL_FORGOT_PASSWORD`, err);
                        return Promise.reject(err);
                    }
                },
            );
        });
    }
}

export default new EmailQueue();