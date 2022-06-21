import {Strategy, Profile} from "passport-facebook"

import { OAuthConfig } from '@config//';
import { Logger } from '@lib/logger';
import { IUser } from '@user-module/interfaces';
import { InternalServerError } from '@exceptions//';
import { PlatformNetwork } from '@platform-module/platform.types';

export const FacebookStrategy =  new Strategy(
    {
        clientID: OAuthConfig.facebookClientId,
        clientSecret: OAuthConfig.facebookClientSecret,
        callbackURL: OAuthConfig.facebookRedirectUrl,
        profileFields: ['emails', 'name', 'picture'],
    },
    async(accessToken, refreshToken, profile: Profile, done) => {
        const log = new Logger(__filename);
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
                    name: PlatformNetwork.FACEBOOK,
                    ssid: id,
                }
            }

            return done(null, user);
        }   
        catch(e:any){
            log.error(e.message)
            throw new InternalServerError(e.message)
        } 
    })