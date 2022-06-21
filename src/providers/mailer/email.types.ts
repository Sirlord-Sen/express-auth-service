import { Options } from 'nodemailer/lib/mailer';

export enum QueueName {
  RESETPASSWORD = 'EMAIL_FORGOT_PASSWORD',
  CONFIRMACCOUNT = 'EMAIL_CONFIRM_ACCOUNT'
}

export type SendEmail = Pick<Options, 'from' | 'to' | 'subject' | 'text' | 'html'>;

export type DeployEmail = {
  subject: string;
  html: string;
};

export type EmailRequest = {
  email: string;
  token?: string;
};

export type EmailJob = {
  request: EmailRequest;
  deploy: DeployEmail;
}