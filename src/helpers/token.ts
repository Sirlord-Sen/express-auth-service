import { IncomingHttpHeaders } from 'http';
import { BadRequestError } from '@utils/error-response.util';
import { TokenType } from '@utils/util-types';


export default (() => {
    const getTokenFromHeader = (headers: IncomingHttpHeaders): string | undefined => {
        const authorization = headers.authorization || headers.Authorization;

        if(
        authorization &&
        typeof authorization === 'string' &&
        authorization.startsWith(`${TokenType.BEARER} `)
        ){
            return authorization.split(`${TokenType.BEARER} `)[1] || undefined;
        }
        return undefined;
  };

    const getTokenFromCookies = (cookies: any): string => {
        const { refreshToken } = cookies as { refreshToken : string };
        if (!refreshToken) throw new BadRequestError('No Refresh Token')
        return refreshToken;
    };

    return {
        getTokenFromHeader,
        getTokenFromCookies,
    };
})();