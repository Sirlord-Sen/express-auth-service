import { OAuthConfig } from '@config//';
import {Strategy, Profile} from "passport-facebook"
import { InternalServerError } from '@utils/error-response.util';
import { Logger } from '@utils/logger.util';
import { PlatformNetwork } from '../../modules/platform/platform.types';

export const FacebookStrategy =  new Strategy(
    {
        clientID: OAuthConfig.facebookClientId,
        clientSecret: OAuthConfig.facebookClientSecret,
        callbackURL: OAuthConfig.facebookRedirectUrl,
        profileFields: ['emails', 'name', 'picture'],
    },
    async(accessToken, refreshToken, profile: Profile, done) => {
        try{
            const { id, name, username, emails, gender, photos } = profile
  
            const user = {
                provider: PlatformNetwork.FACEBOOK,
                providerId: id,
                username,
                email: emails![0].value,
                gender,
                password: 'provided',
                firstName: name?.givenName,
                lastName: name?.familyName,
                picture: photos![0].value,
                accessToken
            }
            return done(null, user);
        }   
        catch(e:any){
            Logger.error(e.message)
            throw new InternalServerError(e.message)
        } 
    })