import nodemailer,{ createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailConfig } from '../../config';
import { OAuthConfig } from '../../config'
import { SendEmail } from './email.types';
import { google } from 'googleapis'

class EmailService {

    createTransporter = async() =>{
        const OAuth2 = google.auth.OAuth2
        const oauth2Client = new OAuth2(
            OAuthConfig.clientId,
            OAuthConfig.clientSecret,
            "https://developers.google.com/oauthplayground"
          );
          
        oauth2Client.setCredentials({
            refresh_token: OAuthConfig.refreshToken
        });

        const accessToken: string = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.log(err)
                    reject("Failed to create access token :(");
                }
                resolve(String(token));
            });
        });

        const transporter = createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EmailConfig.username,
                accessToken,
                clientId: OAuthConfig.clientId,
                clientSecret: OAuthConfig.clientSecret,
                refreshToken: OAuthConfig.refreshToken
            },
            // tls: {
            //   rejectUnauthorized: false
            // }
        });

        return transporter
    }


    // async transport(){
      
    // }

    async sendEmail(data: SendEmail): Promise<any> {
        let emailTransporter = await this.createTransporter();
        return await emailTransporter.sendMail(data);
   }
}

export default new EmailService();