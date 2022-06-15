import * as uuid from 'uuid';
import * as nock from 'nock';
import { UserEntity } from '@modules/user/entity';
import { RepositoryMock } from '../utils/repository.mock';
import { UserService } from '@modules/user/services/user.service';
import { TokenService } from '@modules/auth/services/token.service';
import { JWTService } from '@providers/jwt';
import { RefreshTokenRepository } from '@modules/auth/repository/refreshToken.repository';
import { closeRedis, createRedisConnection } from 'test/utils/cache';
import { Redis } from 'ioredis-mock';

describe('UserService', () => {
    let redis: Redis;
    let user: UserEntity;
    let userService: UserService;
    let userRepo: RepositoryMock<UserEntity>
    let refreshRepo: RepositoryMock<RefreshTokenRepository>

    beforeAll(async() => {
        redis = await createRedisConnection()
        user = new UserEntity();
        userRepo = new RepositoryMock<UserEntity>();
        refreshRepo = new RepositoryMock<RefreshTokenRepository>()
        const jwtService = new JWTService()
        const tokenService = new TokenService(refreshRepo as any, userRepo as any, jwtService)
        userService = new UserService(userRepo as any, tokenService);
    });

    afterAll(async () => {
        await closeRedis(redis)
        nock.cleanAll();
    })

    it('Find should return a found saved user', async () => {        
        user.id = uuid.v4();
        user.username = 'john';
        user.email = 'john.doe@test.com';
        user.password = "1234";
        userRepo.one = user;
        
        const newUser = await userService.findOneOrFail({id: user.id});
        expect(newUser.id).toBe(user.id)
        expect(newUser.username).toBe(user.username)
        expect(newUser.email).toBe(user.email)
    });

    it('Find should return a newly created user', async () => {        
        user.id = uuid.v4();
        user.username = 'john';
        user.email = 'john.doe@test.com';
        user.password = "1234";
        
        const newUser = await userService.register(user);
        expect(newUser.id).toBe(user.id)
        expect(newUser.username).toBe(user.username)
        expect(newUser.email).toBe(user.email)
    });

});