import {use} from 'passport';
import { OAuthConfig } from '@config//';
import {Strategy, Profile} from "passport-facebook"
import { InternalServerError } from '@utils/error-response.util';
import { Logger } from '@utils/logger.util';
import { PlatformNetwork } from '../platform.types';

use('facebook', new Strategy(
    {
        clientID: OAuthConfig.facebookClientId,
        clientSecret: OAuthConfig.facebookClientSecret,
        callbackURL: OAuthConfig.facebookRedirectUrl
    },
    async(accessToken, refreshToken, profile: Profile, done) => {
        try{
            const { id, name, emails, username } = profile
            
            const user = {
                provider: PlatformNetwork.FACEBOOK,
                providerId: id,
                username,
                email: emails![0].value,
                password: 'provided',
                firstName: name?.givenName,
                lastName: name?.familyName,
                accessToken
            }
            return done(null, user);
        }   
        catch(e:any){
            Logger.error(e.message)
            throw new InternalServerError(e.message)
        } 
    })
);