import Bull, {Job} from 'bull';
import ms from 'ms';
import EmailService from './email.service';
import { ForgotPassword } from './email.types';
import { Logger } from '../../utils/logger.util';
import { EmailConfig } from '../../config';
import { EventEmitter } from 'events';
import QueueCore from '../../core/queue.core';

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
        this.completion()
    }

    async addForgotPasswordToQueue(data: ForgotPassword, opt?: Bull.JobOptions) {
        try{ 
            const job = await this.queue.add('EMAIL_FORGOT_PASSWORD', data, opt) 
            Logger.info(`Job with ID: ${job.id} moved to queue`)
        }
        catch(err){ Logger.error('EMAIL_QUEUQ', err) }
    }

    private process() {
        const EventEmit = new EventEmitter()
        EventEmit.on('start', (): void => {
            this.queue.process('EMAIL_FORGOT_PASSWORD', async (job: Job<ForgotPassword>) => {
                try {
                    const { email, token } = job.data

                    await EmailService.sendEmail({
                        to: email,
                        from: EmailConfig.username,
                        subject: token ? 'Password Reset' : 'Your password has been changed',
                        html: token
                        ? 'You are receiving this because you (or someone else) have requested to reset your account password.\n\n' +
                        'Your reset code is: ' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        : 'Hello,\n\n' + 'This is a confirmation that the password to your account with email ' +
                        email + ' has just been changed.\n',
                    });

                    await job.progress(100)

                    return {status: 'completed'}
                }catch (err) {
                    Logger.error(`EMAIL_QUEUQ EMAIL_FORGOT_PASSWORD`, err)
                    return Promise.reject(err);
                }
            })
        })
        EventEmit.emit('start')
    }

    private completion() {
        this.queue.on('completed', async (job, result) => {
            Logger.info(`Job ${job.id} has ${ result.status }`)
        })
    }
}
