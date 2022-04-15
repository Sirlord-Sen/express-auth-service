import { EntityRepository, Repository } from 'typeorm'
import { InternalServerError, ConflictError } from '@utils/error-response.util';
import UserEntity from '../entity/user.entity'
import { FilterUser, UpdateUser, User } from '../user.types';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
    async createUser(body: User): Promise<UserEntity> {
        try {
            const user = this.create(body);
            await this.save(user);
            return user;
        } 
        catch (err:any) { 
            if (err.code === '23505' || 'ER_DUP_ENTRY') throw new ConflictError('Username or Email already exist')
            throw new InternalServerError('User could not be saved')
        }
    }

    async updateUser(query: FilterUser, body: UpdateUser): Promise<UserEntity>{
        try{ 
            const user = await this.findOneOrFail({ where: query})
            this.merge(user, body)
            await this.save(user)
            return user
        }
        catch(err:any){ throw new InternalServerError('Could not update user')  }
    }
}
