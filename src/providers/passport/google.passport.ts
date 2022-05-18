import { OAuthConfig } from '@config//';
import { IPlatform } from '@modules/platform/interfaces';
import { IUser } from '@modules/user/interfaces';
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
            const { id, name, emails, photos } = profile
            
            const user: IUser = {
                username: emails![0].value.split("@")[0],
                email: emails![0].value,
                password: 'provided',
                profile: {
                    firstname: name?.givenName,
                    lastname: name?.familyName,
                    picture: photos![0].value,
                },
                platform: {
                    name: PlatformNetwork.GOOGLE,
                    ssid: id,
                }
            }
            return done(null, user);
        }
        catch(e: any){
            Logger.error(e.message)
            throw new InternalServerError(e.message)
        }
    })