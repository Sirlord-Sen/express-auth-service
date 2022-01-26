import { UserPayloadDto } from "../../user/dto/user.dto";
import jwt, {SignOptions} from 'jsonwebtoken'

const jwtOpts = {
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
            subject: user.id,
            expiresIn: jwtOpts.ACCESS_TOKEN_EXPIRATION,
        }

        return jwt.sign({},jwtOpts.ACCESS_TOKEN_SECRET, opts);
    }

    async generateRefreshToken(user:UserPayloadDto){
        const opts: SignOptions = {
            subject: user.id,
            expiresIn: jwtOpts.REFRESH_TOKEN_EXPIRATION,
        }

        return jwt.sign({},jwtOpts.REFRESH_TOKEN_SECRET, opts);
    }
}