import {SignOptions, JwtPayload, Secret, VerifyOptions} from 'jsonwebtoken'
import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import JWTService from "@providers/jwt/jwt.service";
import { DateHelper } from "@helpers//";
import RefreshTokenRepository from "../repository/refreshToken.repository";
import { getCustomRepository } from "typeorm";
import { TokenType } from "@utils/utility-types";
import { JwtConfig } from '@config//';
import { UnauthorizedError } from '@utils/error-response.util';
import UserService from '@modules/user/services/user.service';
import { 
    TokensRequest, 
    AccessTokenRequest, 
    RefreshTokenRequest, 
    FullRefreshToken,
    RefreshToken,
    UserAgent,
    TokenPayload
} from "../auth.types";
import { Logger } from '@utils/logger.util';
import TokensCache from '@utils/cache.util';
import { ITokenService } from '../interfaces/service.interface';
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export default class TokenService implements ITokenService{
    constructor(
        @InjectRepository() 
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly jwtService: JWTService,
        private readonly userService: UserService
    ){}

    async generateAccessToken(body:AccessTokenRequest, confirmTokenPassword?: string) {
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

        await TokensCache.setProp(accessToken, userId, ms/1000)
        return {accessToken, expiredAt}
    }

    async generateRefreshToken(body:RefreshTokenRequest, useragent: UserAgent) {
        const jti = nanoid();
        const ms = DateHelper.convertToMS(JwtConfig.refreshTokenExpiration);
        const expiredAt = DateHelper.addMillisecondToDate(new Date(), ms);

        // Only Allowing User to Login again after logout with same broswer and OS
        if ((await this.refreshTokenRepository.findOne({...useragent, ...body , isRevoked: false}))) {
            Logger.warn("Attempting to Signin again from same device");
        }

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

        return { refreshToken }
    }

    async getTokens(body: TokensRequest, agent: UserAgent) {
        const { id, email } = body;
        const [{accessToken, expiredAt}, { refreshToken }] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id }, agent)
        ]);
          
        return { tokenType: TokenType.BEARER ,expiredAt , accessToken, refreshToken };
    }

    async update(query: Partial<FullRefreshToken>, body: Partial<RefreshToken>) {
        await this.refreshTokenRepository.updateRefreshToken(query, body)
    }

    async resolveRefreshToken(token:string) {
        const payload = await this.decodeRefreshToken(token);
        const refreshTokenFromDB = await this.getRefreshTokenFromPayload(payload);

        if (refreshTokenFromDB?.isRevoked) throw new UnauthorizedError('Token expired').send();

        const user = pick(await this.getUserFromRefreshTokenPayload(payload), ['id', 'email']);

        return { user , refreshToken: refreshTokenFromDB };
    }

    private async decodeRefreshToken(token: string){
        const payload = this.jwtService.verify<TokenPayload>(
                token,
                JwtConfig.refreshTokenSecret,
            );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned').send()
        return payload
    }
    
    private getRefreshTokenFromPayload(payload: TokenPayload) {
        const { jti, sub } = payload;
        return this.refreshTokenRepository.findOneToken({ userId: sub, jti });
    }
    
    private getUserFromRefreshTokenPayload(payload: TokenPayload){
        const { sub } = payload;    
        return this.userService.findOneOrFail({ id: sub });
    }

    async decodeForgotPasswordToken(token:string){
        const publicKey = JwtConfig.publicAccessKey
        const verifyOptions: VerifyOptions = {
            algorithms: ['RS256']
        }
        const payload = await this.jwtService.verifyAsync<TokenPayload>(
            token,
            publicKey,
            verifyOptions
        );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned').send()
        return payload
    }
}