import { pick } from 'lodash'
import { nanoid } from 'nanoid'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions';
import { SignOptions, JwtPayload, Secret, VerifyOptions } from 'jsonwebtoken'

import { JwtConfig } from '@config/';
import { DateHelper } from "@helpers/";
import { JWTService } from "@providers/jwt";
import { TokensCache } from '@providers/cache';
import { TokenType } from "@utils/utility-types";
import { Logger, LoggerInterface } from '@decorators/logger';
import { ITokenService } from '../interfaces/service.interface';
import { NotFoundError, UnauthorizedError } from '@exceptions/';
import { RefreshTokenRepository } from "../repository/refreshToken.repository";
import { UserRepository } from "@user-module/repository/user.repository";
import { 
    TokensRequest, 
    AccessTokenRequest, 
    RefreshTokenRequest, 
    FullRefreshToken,
    RefreshToken,
    TokenPayload
} from "../auth.types";
import { IRefreshToken } from '../interfaces';

@Service()
export class TokenService implements ITokenService{
    constructor(
        @InjectRepository() 
        private readonly refreshTokenRepository: RefreshTokenRepository,
        @InjectRepository()
        private readonly userRepository: UserRepository,
        private readonly jwtService: JWTService,
        @Logger(__filename) private log: LoggerInterface,
        // private readonly userService: UserService
    ){}

    async generateAccessToken(body:AccessTokenRequest, confirmationToken?: string) {
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
            jti: confirmationToken || nanoid(),
            sub: String(userId),
            typ: TokenType.BEARER
        };
        const accessToken = await this.jwtService.signAsync<JwtPayload>(payload, privateAccessSecret , opts)

        const ms = DateHelper.convertToMS(JwtConfig.accessTokenExpiration)
        const expiresAt = DateHelper.addMillisecondToDate(new Date(), ms);

        confirmationToken ? undefined : await TokensCache.setProp(accessToken, userId, ms/1000)
        return {accessToken, expiresAt}
    }

    async generateRefreshToken(body:RefreshTokenRequest, ctx: Context) {
        const jti = nanoid();
        const ms = DateHelper.convertToMS(JwtConfig.refreshTokenExpiration);
        const expiresAt = DateHelper.addMillisecondToDate(new Date(), ms);

        // Only Allowing User to Login again after logout with same broswer and OS
        if ((await this.refreshTokenRepository.findOne({...ctx, ...body , isRevoked: false})))
            this.log.warn("Attempting to Signin again from same device");

        const savedRefreshToken = await this.refreshTokenRepository.createEntity({ ...body, ...ctx ,jti, expiresAt });

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

    async getTokens(body: TokensRequest, ctx: Context) {
        const { id, email } = body;
        const [{accessToken, expiresAt}, { refreshToken }] = await Promise.all([
            this.generateAccessToken({ email: email, userId: id }),
            this.generateRefreshToken({ userId: id }, ctx)
        ]);
          
        return { tokenType: TokenType.BEARER ,expiresAt , accessToken, refreshToken };
    }

    async findOneOrFail( query: Partial<IRefreshToken> ): Promise<IRefreshToken> {
        try{ return await this.refreshTokenRepository.findOneOrFail({ where: query }); }
        catch(err){ throw new NotFoundError("Refresh Token not found") }
    }

    async update(query: Partial<FullRefreshToken>, body: Partial<RefreshToken>) {
        await this.refreshTokenRepository.updateEntity(query, body)
    }

    async resolveRefreshToken(token:string) {
        const payload = await this.decodeRefreshToken(token);
        const refreshTokenFromDB = await this.getRefreshTokenFromPayload(payload);

        if (refreshTokenFromDB?.isRevoked) throw new UnauthorizedError('Please log in');

        const user = pick(await this.getUserFromRefreshTokenPayload(payload), ['id', 'email']);

        await this.update({ userId: user.id, jti: payload.jti } , {isRevoked: true })

        return user;
    }

    public async decodeRefreshToken(token: string){
        const payload = await this.jwtService.verifyAsync<TokenPayload>(
                token,
                JwtConfig.refreshTokenSecret,
            );
        const { jti, sub } = payload
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned')
        return payload
    }
    
    private async getRefreshTokenFromPayload(payload: TokenPayload) {
        const { jti, sub } = payload;
        return await this.findOneOrFail({ userId: sub, jti });
    }
    
    private async getUserFromRefreshTokenPayload(payload: TokenPayload){  
        try{return await this.userRepository.findOneOrFail({ id: payload.sub });}
        catch(e){ throw new NotFoundError('User not found')}
    }

    async decodeConfirmationToken(token:string){
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
        if (!jti || !sub) throw new UnauthorizedError('Token Malfunctioned')
        return payload
    }
}