import {SignOptions, JwtPayload, Secret, VerifyOptions} from 'jsonwebtoken'
import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import JWTService from "@providers/jwt/jwt.service";
import { DateHelper } from "@helpers//";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { getCustomRepository } from "typeorm";
import { TokenType } from "@utils/utility-types";
import { JwtConfig } from '@config//';
import { IRefreshToken, IRefreshTokenResponse, ITokenResponse } from '../interfaces/refresh-token.interface';
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
    AccessTokenResponse,
    UserAgentDets
} from "../auth.types";
import { Logger } from '@utils/logger.util';
import TokensCache from '@utils/cache.util';
import RefreshTokenEntity from '../entity/refresh-token.entity';


export default class TokenService {
    private readonly refreshTokenRepository: RefreshTokenRepository
    private readonly jwtService: JWTService
    private readonly userService: UserService
    private readonly tokenCache
    tokenType : TokenType
    constructor(){
        this.refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
        this.jwtService = new JWTService()
        this.userService = new UserService()
        this.tokenCache = TokensCache
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

    async lastSignIn(body:RefreshTokenRequest, useragent: UserAgentDets): Promise<RefreshTokenEntity | undefined>{
        const lastSignIn = (await this.refreshTokenRepository.find({
            where: {
                ...useragent, 
                ...body, 
                isRevoked: true
            },   
            order: {
                created_at: "DESC"
            }
        }))[0]
        if(lastSignIn) return lastSignIn
        return undefined
    }

    async generateRefreshToken(body:RefreshTokenRequest, useragent: UserAgentDets):Promise<IRefreshTokenResponse>{
        const jti = nanoid();
        const ms = DateHelper.convertToMS(JwtConfig.refreshTokenExpiration);
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        // Only Allowing User to Login again after logout with same broswer and OS
        if ((await this.refreshTokenRepository.findOne({...useragent, ...body , isRevoked: false}))) {
            Logger.warn("Attempting to Signin again from same device");
        }

        const lastSignIn = (await this.lastSignIn(body, useragent))?.created_at

        const savedRefreshToken = await this.refreshTokenRepository.createRefreshToken({ ...body, ...useragent ,jti, expiredAt });

        const opts: SignOptions = {
            expiresIn: JwtConfig.refreshTokenExpiration,
        }

        const payload: JwtPayload = {
            sub: String(savedRefreshToken.userId),
            jti,
            typ: TokenType.BEARER,
        };

        const refreshToken = this.jwtService.sign<JwtPayload>(payload, JwtConfig.refreshTokenSecret, opts)

        return { refreshToken, lastSignIn }
    }

    async getTokens(body: TokenRequest, agent: UserAgentDets):Promise<ITokenResponse>{
        const { id, email } = body;
        const [{accessToken, expiredAt}, {refreshToken, lastSignIn}] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id }, agent)
        ]);
          
        return { tokenType: this.tokenType ,expiredAt , accessToken, refreshToken ,lastSignIn};
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