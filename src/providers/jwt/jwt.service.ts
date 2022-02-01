import jwt from 'jsonwebtoken';
import { DateHelper } from '../../helpers';
import { UnauthorizedError } from '../../utils/error-response.util';

export default class JWTService {
//   decode(
//     token: string,
//     options?: jwt.DecodeOptions,
//   ): null | { [key: string]: any } | string {
//     return jwt.decode(token, options);
//   }

    sign<T>(payload: T, secret: string, opts?: jwt.SignOptions): string {
        return jwt.sign(
            { ...payload, iat: DateHelper.getUnixTimeOfDate() },
            secret,
            opts,
        );
  }

    signAsync<T>(payload: T, secret: string, opts?: jwt.SignOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { ...payload, iat: DateHelper.getUnixTimeOfDate() },
                secret,
                opts || {},
                (err, encoded) => (err ? reject(err) : resolve(encoded as string)),
            );
        });
    }

//   verify<T>(token: string, secret: string) {
//     return jwt.verify(token, secret) as T;
//   }

    async verifyAsync<T>(token: string, secret: string): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (error, decoded) => {
                if (error && error.name === 'TokenExpiredError')
                    return reject(new UnauthorizedError('Token Expired').send());
                if (decoded)
                    return resolve(decoded as unknown as T);
                
                return reject(new UnauthorizedError('Token Malfunctioned').send());
            });
        });
    }

}