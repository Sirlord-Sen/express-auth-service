import uuid from 'uuid'
import { UserEntity } from '@modules/user/entity';
import { RepositoryMock } from '../utils/repository.mock';
import { UserService } from '@modules/user/services/user.service';
import { TokenService } from '@modules/auth/services/token.service';
import { JWTService } from '@providers/jwt';

describe('UserService', () => {
    let user: UserEntity;
    let userService: UserService;
    let userRepo: RepositoryMock<UserEntity>

    beforeEach(() => {
        user = new UserEntity();
        userRepo = new RepositoryMock();
        const jwtService = new JWTService()
        const tokenService = new TokenService(userRepo as any, userRepo as any, jwtService)
        userService = new UserService(userRepo as any, tokenService);
    });

    it('Find should return a list of users', async () => {        
        user.id = uuid.v4();
        user.username = 'john'
        user.email = 'john.doe@test.com';
        userRepo.one = user;
        
        const list = await userService.findOneOrFail({id: user.id});
        expect(list.username).toBe(user.username);
    });

});