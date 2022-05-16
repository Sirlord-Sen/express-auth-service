import { OAuthConfig } from '@config//';
import { InternalServerError } from '@utils/error-response.util';
import { Logger } from '@utils/logger.util';
import { OAuth2Strategy, Profile } from 'passport-google-oauth'
import { PlatformNetwork } from '../../modules/platform/platform.types';

export const GoogleStrategy = new OAuth2Strategy(
    {
        clientID: OAuthConfig.googleClientId,
        clientSecret: OAuthConfig.googleClientSecret,
        callbackURL: OAuthConfig.googleRedirectUrl
    },
    async( accessToken: string, refreshToken: string, profile: Profile, done) => {
        try{
            const { id, name, emails, username, gender, photos } = profile

            const user = {
                provider: PlatformNetwork.GOOGLE,
                providerId: id,
                username,
                email: emails![0].value,
                gender,
                password: 'provided',
                firstname: name?.givenName,
                lastname: name?.familyName,
                photos: photos![0].value,
                accessToken
            }
            return done(null, user);
        }
        catch(e: any){
            Logger.error(e.message)
            throw new InternalServerError(e.message)
        }
    })