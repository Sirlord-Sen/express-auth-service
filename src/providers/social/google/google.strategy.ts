import { OAuth2Strategy, Profile } from 'passport-google-oauth'

import { OAuthConfig } from '@config/';
import { Logger } from '@lib/logger';
import { IUser } from '@user-module/interfaces';
import { InternalServerError } from '@exceptions/';
import { PlatformNetwork } from '@platform-module/platform.types';

export const GoogleStrategy = new OAuth2Strategy(
    {
        clientID: OAuthConfig.googleClientId,
        clientSecret: OAuthConfig.googleClientSecret,
        callbackURL: OAuthConfig.googleRedirectUrl
    },
    async( accessToken: string, refreshToken: string, profile: Profile, done) => {
        const log = new Logger(__filename)
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
            log.error(e.message)
            throw new InternalServerError(e.message)
        }
    })