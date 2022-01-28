import { UserPayloadDto } from "../../user/dto/user.dto";
import jwt, {SignOptions, JwtPayload} from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { TokenRequest, AccessTokenRequest, RefreshTokenRequest } from "../auth.types";
import JWTService from "../../../providers/jwt/jwt.service";
import { DateHelper } from "../../../helpers";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { getCustomRepository } from "typeorm";

const JwtConfig = {
    ACCESS_TOKEN_EXPIRATION : String(process.env.ACCESS_TOKEN_EXPIRATION),
    ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),
    REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET),
    REFRESH_TOKEN_EXPIRATION: String(process.env.REFRESH_TOKEN_EXPIRATION)
}

export default class TokenService {
    private readonly jwtService: JWTService
    private readonly refreshTokenRepository: RefreshTokenRepository
    constructor(){
        this.jwtService = new JWTService()
        this.refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
    }

    async generateAccessToken(body:AccessTokenRequest){
        const opts: SignOptions = {
            expiresIn: JwtConfig.ACCESS_TOKEN_EXPIRATION,
        }
        const payload: JwtPayload = {
            ...body,
            jti: nanoid(),
            sub: String(body.userId),
            typ: 'Bearer'
          };

        return this.jwtService.signAsync<JwtPayload>(payload, JwtConfig.ACCESS_TOKEN_SECRET, opts)
    }

    async generateRefreshToken(body:RefreshTokenRequest){
        const jti = nanoid();
        const ms = DateHelper.convertToMS(JwtConfig.REFRESH_TOKEN_EXPIRATION);
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        await this.refreshTokenRepository.createRefreshToken({ ...body, jti, expiredAt });

        const opts: SignOptions = {
            expiresIn: JwtConfig.REFRESH_TOKEN_EXPIRATION,
        }

        const payload: JwtPayload = {
            sub: String(body.userId),
            jti,
            typ: 'Bearer',
        };

        return this.jwtService.sign<JwtPayload>(payload, JwtConfig.REFRESH_TOKEN_SECRET, opts)
    }

    async getTokens(body: TokenRequest){
        const { id, email } = body;
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id }),
          ]);
      
          return { tokenType: 'Bearer', accessToken, refreshToken };
    }
}