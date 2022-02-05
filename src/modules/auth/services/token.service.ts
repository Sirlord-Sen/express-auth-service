import {SignOptions, JwtPayload} from 'jsonwebtoken'
import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import JWTService from "@providers/jwt/jwt.service";
import { DateHelper } from "@helpers//";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { getCustomRepository } from "typeorm";
import { TokenType } from "@utils/util-types";
import { JwtConfig } from '@config//';
import { IRefreshToken, ITokenResponse } from '../interfaces/token.interface';
import { UnauthorizedError } from '@utils/error-response.util';
import UserService from '@modules/user/services/user.service';
import { FullUser } from '@modules/user/user.types';
import { 
    TokenRequest, 
    AccessTokenRequest, 
    RefreshTokenRequest, 
    FullRefreshToken, 
    RefreshTokenPayload, 
    RefreshToken, 
    AccessTokenPayload 
} from "../auth.types";


export default class TokenService {
    private readonly refreshTokenRepository: RefreshTokenRepository
    private readonly jwtService: JWTService
    private readonly userService: UserService
    tokenType : TokenType
    constructor(){
        this.refreshTokenRepository = getCustomRepository(RefreshTokenRepository)
        this.jwtService = new JWTService()
        this.userService = new UserService()
        this.tokenType = TokenType.BEARER 
    }

    async generateAccessToken(body:AccessTokenRequest, confirmTokenPassword?: string):Promise<string>{
        const opts: SignOptions = {
            expiresIn: JwtConfig.accessTokenExpiration,
        }
        const payload: JwtPayload = {
            ...body,
            jti: confirmTokenPassword || nanoid(),
            sub: String(body.userId),
            typ: TokenType.BEARER
          };

        return await this.jwtService.signAsync<JwtPayload>(payload, JwtConfig.accessTokenSecret, opts)
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
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id })
        ]);
          
        return { tokenType: this.tokenType , accessToken, refreshToken };
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
        const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
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

    async decodeAccessToken(token:string): Promise<AccessTokenPayload> {
        const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
            token,
            JwtConfig.accessTokenSecret,
        );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned').send()
        return payload
    }
}