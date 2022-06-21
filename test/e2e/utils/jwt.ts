import { JwtConfig } from "@config/";
import { DateHelper } from "@helpers/";
import { TokenType } from "@utils/utility-types";
import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import { nanoid } from "nanoid";


export const privateAccessSecret: Secret = {
    key: JwtConfig.privateAccessKey,
    passphrase: JwtConfig.privateAccessKeyPassphrase
}

export const opts: SignOptions = {
    expiresIn: JwtConfig.accessTokenExpiration,
    algorithm: 'RS256'
}

export const payload = (body: {userId: string, email: string, token?: string}) : JwtPayload => {
    return {
        ...body,
        jti: body.token || nanoid(),
        sub: String(body.userId),
        typ: TokenType.BEARER
    }
};

export const signAccessJwt = (body: {userId: string, email: string, token?: string}) : string => {
    const privateAccessSecret: Secret = {
        key: JwtConfig.privateAccessKey,
        passphrase: JwtConfig.privateAccessKeyPassphrase
    }

    const opts: SignOptions = {
        expiresIn: JwtConfig.accessTokenExpiration,
        algorithm: 'RS256'
    }

    const payload: JwtPayload = {
        ...body,
        jti: body.token || nanoid(),
        sub: String(body.userId),
        typ: TokenType.BEARER
    };
    return sign(payload, privateAccessSecret, opts)
}

export const signRefreshJwt = (body: {userId: string, jti: string}) : string => {
    const { userId, jti } = body

    const opts: SignOptions = {
        expiresIn: JwtConfig.refreshTokenExpiration,
    }

    const payload: JwtPayload = {
        sub: String(userId),
        jti,
        typ: TokenType.BEARER,
    };

    return sign(payload, JwtConfig.refreshTokenSecret, opts)
}

export const sign = (payload: JwtPayload, secret: Secret, opts?: SignOptions): string =>{
        return jwt.sign(
            { ...payload, iat: DateHelper.getUnixTimeOfDate() },
            secret,
            opts,
        );
    }