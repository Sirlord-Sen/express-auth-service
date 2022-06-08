import { JwtConfig } from "@config//";
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

export const payload = (body: {userId: string, email: string}) : JwtPayload => {
    return {
        ...body,
        jti: nanoid(),
        sub: String(body.userId),
        typ: TokenType.BEARER
    }
};

export const signJwt = (body: {userId: string, email: string}) : string => {
    return jwt.sign(payload(body), privateAccessSecret, opts)
}