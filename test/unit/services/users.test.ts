import * as uuid from 'uuid';
import * as nock from 'nock';
import { UserEntity } from '@modules/user/entity';
import { RepositoryMock } from '../utils/repository.mock';
import { UserService } from '@modules/user/services/user.service';
import { TokenService } from '@modules/auth/services/token.service';
import { JWTService } from '@providers/jwt';
import { RefreshTokenRepository } from '@modules/auth/repository/refreshToken.repository';

describe('UserService', () => {
    let user: UserEntity;
    let userService: UserService;
    let userRepo: RepositoryMock<UserEntity>
    let refreshRepo: RepositoryMock<RefreshTokenRepository>

    beforeAll(() => {
        user = new UserEntity();
        userRepo = new RepositoryMock<UserEntity>();
        refreshRepo = new RepositoryMock<RefreshTokenRepository>()
        const jwtService = new JWTService()
        const tokenService = new TokenService(refreshRepo as any, userRepo as any, jwtService)
        userService = new UserService(userRepo as any, tokenService);
    });

    afterAll(async () => {
        nock.cleanAll();
    })

    it('Find should return a list of users', async () => {        
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

});