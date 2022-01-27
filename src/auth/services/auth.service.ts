import { UserPayloadDto } from "../../user/dto/user.dto";
import jwt, {SignOptions, JwtPayload} from 'jsonwebtoken'
import { nanoid } from 'nanoid'

const JwtConfig = {
    ACCESS_TOKEN_EXPIRATION : String(process.env.ACCESS_TOKEN_EXPIRATION),
    ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),
    REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET),
    REFRESH_TOKEN_EXPIRATION: String(process.env.REFRESH_TOKEN_EXPIRATION)
}

export class AuthService {

    constructor(){
    }

    async generateAccessToken(user:UserPayloadDto){
        const opts: SignOptions = {
            expiresIn: JwtConfig.ACCESS_TOKEN_EXPIRATION,
        }

        const payload: JwtPayload = {
            ...user,
            jti: nanoid(),
            sub: String(user.id),
            typ: 'Bearer'
          };

        return jwt.sign(payload,JwtConfig.ACCESS_TOKEN_SECRET, opts);
    }

    async generateRefreshToken(user:UserPayloadDto){
        const opts: SignOptions = {
            subject: user.id,
            expiresIn: JwtConfig.REFRESH_TOKEN_EXPIRATION,
        }

        return jwt.sign({},JwtConfig.REFRESH_TOKEN_SECRET, opts);
    }
}