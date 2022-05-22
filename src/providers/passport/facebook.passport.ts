import { OAuthConfig } from '@config//';
import {Strategy, Profile} from "passport-facebook"
import { InternalServerError } from '@exceptions//';
import { Logger } from '@utils/logger.util';
import { PlatformNetwork } from '../../modules/platform/platform.types';
import { IUser } from '@modules/user/interfaces';

export const FacebookStrategy =  new Strategy(
    {
        clientID: OAuthConfig.facebookClientId,
        clientSecret: OAuthConfig.facebookClientSecret,
        callbackURL: OAuthConfig.facebookRedirectUrl,
        profileFields: ['emails', 'name', 'picture'],
    },
    async(accessToken, refreshToken, profile: Profile, done) => {
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
            Logger.error(e.message)
            throw new InternalServerError(e.message)
        } 
    })