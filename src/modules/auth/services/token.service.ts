import {SignOptions, JwtPayload, Secret, VerifyOptions} from 'jsonwebtoken'
import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import JWTService from "@providers/jwt/jwt.service";
import { DateHelper } from "@helpers//";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { getCustomRepository } from "typeorm";
import { TokenType } from "@utils/util-types";
import { JwtConfig } from '@config//';
import { IRefreshToken, ITokenResponse } from '../interfaces/token.interface';
import { InternalError, UnauthorizedError } from '@utils/error-response.util';
import UserService from '@modules/user/services/user.service';
import { FullUser } from '@modules/user/user.types';
import { 
    TokenRequest, 
    AccessTokenRequest, 
    RefreshTokenRequest, 
    FullRefreshToken, 
    RefreshTokenPayload, 
    RefreshToken, 
    AccessTokenPayload, 
    AccessTokenResponse
} from "../auth.types";
import { Logger } from '@utils/logger.util';
import TokensCache from '@utils/cache.util';


export default class TokenService {
    private readonly refreshTokenRepository: RefreshTokenRepository
    private readonly jwtService: JWTService
    private readonly userService: UserService
    private readonly tokenCache: TokensCache
    tokenType : TokenType
    constructor(){
        this.refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
        this.jwtService = new JWTService()
        this.userService = new UserService()
        this.tokenCache = new TokensCache()
        this.tokenType = TokenType.BEARER 
    }

    async generateAccessToken(body:AccessTokenRequest, confirmTokenPassword?: string):Promise<AccessTokenResponse>{
        const { userId } = body
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
            jti: confirmTokenPassword || nanoid(),
            sub: String(userId),
            typ: TokenType.BEARER
        };
        const accessToken = await this.jwtService.signAsync<JwtPayload>(payload, privateAccessSecret , opts)

        const ms = DateHelper.convertToMS(JwtConfig.accessTokenExpiration)
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        await this.tokenCache.setProp(accessToken, userId, ms/1000)
        return {accessToken, expiredAt}
    }

    async generateRefreshToken(body:RefreshTokenRequest):Promise<string>{
        const jti = nanoid();
        const ms = DateHelper.convertToMS(JwtConfig.refreshTokenExpiration);
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        const savedRefreshToken = await this.refreshTokenRepository.createRefreshToken({ ...body, jti, expiredAt });

        const opts: SignOptions = {
            expiresIn: JwtConfig.refreshTokenExpiration,
        }

        const payload: JwtPayload = {
            sub: String(savedRefreshToken.userId),
            jti,
            typ: TokenType.BEARER,
        };

        return this.jwtService.sign<JwtPayload>(payload, JwtConfig.refreshTokenSecret, opts)
    }

    async getTokens(body: TokenRequest):Promise<ITokenResponse>{
        const { id, email } = body;
        const [{accessToken, expiredAt}, refreshToken] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id })
        ]);
          
        return { tokenType: this.tokenType ,expiredAt , accessToken, refreshToken};
    }

    async update(query: Partial<FullRefreshToken>, body: Partial<IRefreshToken>): Promise<void>{
        await this.refreshTokenRepository.updateRefreshToken(query, body)
    }

    async resolveRefreshToken(token:string): Promise<{user: TokenRequest, refreshToken: RefreshToken}> {
        const payload = await this.decodeRefreshToken(token);
        const refreshTokenFromDB = await this.getRefreshTokenFromPayload(payload);

        if (refreshTokenFromDB?.isRevoked) throw new UnauthorizedError('Token expired').send();

        const user = pick(await this.getUserFromRefreshTokenPayload(payload), ['id', 'email']);

        return { user , refreshToken: refreshTokenFromDB };
    }

    private async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        const payload = this.jwtService.verify<RefreshTokenPayload>(
                token,
                JwtConfig.refreshTokenSecret,
            );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned').send()
        return payload
    }
    
    private getRefreshTokenFromPayload(payload: RefreshTokenPayload): Promise<IRefreshToken>{
        const { jti, sub } = payload;
        return this.refreshTokenRepository.findOneToken({ userId: sub, jti });
    }
    
    private getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<FullUser> {
        const { sub } = payload;    
        return this.userService.findOne({ id: sub });
    }

    async decodeForgotPasswordToken(token:string): Promise<AccessTokenPayload> {
        const publicKey = JwtConfig.publicAccessKey
        const verifyOptions: VerifyOptions = {
            algorithms: ['RS256']
        }
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
            token,
            publicKey,
            verifyOptions
        );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned').send()
        return payload
    }
}