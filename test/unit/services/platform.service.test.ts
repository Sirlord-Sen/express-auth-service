import * as uuid from 'uuid';
import * as nock from 'nock';
import { UserEntity } from '@modules/user/entity';
import { RepositoryMock } from '../utils/repository.mock';
import { PlatformService } from '@modules/platform/services/platform.service';
import { PlatformEntity } from '@modules/platform/entity';
import { NewDummyPlatform, NewDummyProfile, NewDummyUser } from 'test/utils/dummy';

describe('PlatformService', () => {
    let platformService: PlatformService;
    let userRepo: RepositoryMock<UserEntity>
    let platformRepo: RepositoryMock<PlatformEntity>

    beforeAll(async() => {
        platformRepo = new RepositoryMock<PlatformEntity>();
        userRepo = new RepositoryMock<UserEntity>();
        platformService = new PlatformService(platformRepo as any, userRepo as any);
    });

    afterAll(async () => {
        nock.cleanAll();
    })

    it('Create should return a created user from social platform', async () => {      
        const dummy = {
            id: uuid.v4(),
            ...NewDummyUser(),
            profile: NewDummyProfile(),
            platform: NewDummyPlatform()
        } 
        
        const newUser = await platformService.create(dummy);
        expect(newUser.id).toBe(dummy.id)
        expect(newUser.username).toBe(dummy.username)
        expect(newUser.email).toBe(dummy.email)
    });
});