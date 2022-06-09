import { Service } from 'typedi'
import jwt, { Secret, SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken';

import { DateHelper } from '@helpers//';
import { Logger } from '@utils/logger.util';
import { CodeError } from '@utils/utility-types' 
import { InternalServerError, UnauthorizedError } from '@exceptions//';

@Service()
export default class JWTService {

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
                (err: CodeError | null, encoded) => {
                    if (err) {
                        Logger.error(`${err}`)
                        reject(new InternalServerError(`${err}`, err.code))
                    }
                    resolve(encoded as string)}
            );
        });
    }

    verify<T>(token: string, secret: string) {
        return jwt.verify(token, secret) as T;
    }

    async verifyAsync<T>(token: string, key: Secret, opts?: VerifyOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, key, opts, (error: VerifyErrors | null, decoded) => {
                if (error && error.name === 'TokenExpiredError')
                    return reject(new UnauthorizedError('Token Expired'));
                if (decoded)
                    return resolve(decoded as unknown as T);
                
                return reject(new UnauthorizedError('Token Malfunctioned'));
            });
        });
    }

}