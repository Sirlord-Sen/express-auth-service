import { UserRepository } from '@modules/user/repository/user.repository';
import { User } from '@modules/user/user.types';
import { pick } from 'lodash';
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IPlatformService } from '../interfaces/service.interface';
import { PlatformRepository } from '../repository/platform.repository';

@Service()
export class PlatformService implements IPlatformService{
    constructor(
        @InjectRepository()
        private platformRepository: PlatformRepository,
        @InjectRepository()
        private userRepository: UserRepository,
    ){}

    async create(body: User){
        const foundUser = await this.userRepository.findOne({email: body.email})
        if(foundUser) return pick(foundUser, ['id', 'email', 'username'])
        const user = await this.userRepository.createUser({...body, isActive: true, isAccountActivated: true})
        await this.platformRepository.createPlatform({...body.platform!, userId: user.id})
        return pick(user, ['id', 'email', 'username'])
    }
}