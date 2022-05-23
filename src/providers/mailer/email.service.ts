import { createTransport } from 'nodemailer';
import { EmailConfig } from '@config//';
import { OAuthConfig } from '@config//'
import { SendEmail } from './email.types';
import { google } from 'googleapis'
import { Service } from 'typedi'

@Service()
class EmailService {

    createTransporter = async() =>{
        const OAuth2 = google.auth.OAuth2
        const oauth2Client = new OAuth2(
            OAuthConfig.googleClientId,
            OAuthConfig.googleClientSecret,
            "https://developers.google.com/oauthplayground"
          );
          
        oauth2Client.setCredentials({
            refresh_token: OAuthConfig.googleRefreshToken
        });

        const accessToken: string = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) reject(err);
    
                resolve(String(token));
            });
        });

        const transporter = createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EmailConfig.username,
                accessToken,
                clientId: OAuthConfig.googleClientId,
                clientSecret: OAuthConfig.googleClientSecret,
                refreshToken: OAuthConfig.googleRefreshToken
            },
            tls: { rejectUnauthorized: false }
        });

        return transporter
    }

    async sendEmail(data: SendEmail): Promise<any> {
        try{
            const emailTransporter = await this.createTransporter();
            return await emailTransporter.sendMail(data);
        }
        catch(err) { throw err }
        
   }
}

export default new EmailService();