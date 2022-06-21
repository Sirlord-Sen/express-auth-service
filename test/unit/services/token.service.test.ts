import * as uuid from 'uuid';
import * as nock from 'nock';
import { UserEntity } from '@modules/user/entity';
import { RepositoryMock } from '../utils/repository.mock';
import { NewDummyUser } from 'test/utils/dummy';
import { TokenService } from '@modules/auth/services/token.service';
import { RefreshTokenEntity } from '@modules/auth/entity';
import { JWTService } from '@providers/jwt';
import { LogMock } from '../utils/logger.mock';

describe('TokenService', () => {
    let log : LogMock;
    let tokenService: TokenService;
    let userRepo: RepositoryMock<UserEntity>
    let refreshRepo: RepositoryMock<RefreshTokenEntity>

    beforeAll(async() => {
        log = new LogMock();
        userRepo = new RepositoryMock<UserEntity>();
        refreshRepo = new RepositoryMock<RefreshTokenEntity>()
        const jwtService = new JWTService(log)
        tokenService = new TokenService(refreshRepo as any, userRepo as any, jwtService, log);
    });

    afterAll(async () => {
        nock.cleanAll();
    })

    it('generateAccessToken should return access token and expiry', async () => {      
        const dummy = NewDummyUser()
        const token = await tokenService.generateAccessToken({userId: uuid.v4(), email: dummy.email});
        expect(token.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(token.expiresAt instanceof Date).toBe(true)
    });

    it('generateRefreshToken should return refresh token', async () => {      
        const ctx: Context = {os: "Mac", browser: "Google Chrome"}
        const token = await tokenService.generateRefreshToken({userId: uuid.v4()}, ctx);
        expect(token.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    });

    it('getTokens should return refresh & access token, expiresAt and Bearer Type', async () => {     
        const dummy = NewDummyUser() 
        const ctx: Context = {os: "Mac", browser: "Google Chrome"}
        const token = await tokenService.getTokens({id: uuid.v4(), email: dummy.email}, ctx);
        expect(token.tokenType).toBe("Bearer")
        expect(token.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(token.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(token.expiresAt instanceof Date).toBe(true);
    });

});