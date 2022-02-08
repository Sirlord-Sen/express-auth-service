import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { DateHelper } from '@helpers//';
import { InternalError, UnauthorizedError } from '@utils/error-response.util';
import { Logger } from '@utils/logger.util';

interface SignError extends Error {
    code?: string;
}

export default class JWTService {
//   decode(
//     token: string,
//     options?: jwt.DecodeOptions,
//   ): null | { [key: string]: any } | string {
//     return jwt.decode(token, options);
//   }

    sign<T>(payload: T, secret: string, opts?: SignOptions): string {
        return jwt.sign(
            { ...payload, iat: DateHelper.getUnixTimeOfDate() },
            secret,
            opts,
        );
  }


    signAsync<T>(payload: T, secret: Secret, opts?: SignOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { ...payload, iat: DateHelper.getUnixTimeOfDate() },
                secret,
                opts || {},
                (err: SignError | null, encoded) => {
                    if (err) {
                        Logger.error(`${err}`)
                        reject(new InternalError(`${err}`, err.code).send())
                    }
                    resolve(encoded as string)}
            );
        });
    }

  verify<T>(token: string, secret: string) {
    return jwt.verify(token, secret) as T;
  }

    async verifyAsync<T>(token: string, key: Secret, opts: VerifyOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, opts, (error, decoded) => {
                if (error && error.name === 'TokenExpiredError')
                    return reject(new UnauthorizedError('Token Expired').send());
                if (decoded)
                    return resolve(decoded as unknown as T);
                
                return reject(new UnauthorizedError('Token Malfunctioned').send());
            });
        });
    }

}