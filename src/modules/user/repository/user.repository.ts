import { EntityRepository, Repository } from 'typeorm'
import { InternalError, ConflictError } from '../../../utils/error-response.util';
import UserEntity from '../entity/user.entity'
import { IReturnUser, IUser } from '../interfaces/user.interface';
import { FullUser } from '../user.types';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
    async createUser(body: IUser): Promise<UserEntity> {
        try {
            const user = this.create(body);
            await this.save(user);
    
            return user;
        } 
        catch (err:any) { 
            if (err.code === '23505' || 'ER_DUP_ENTRY') throw new ConflictError('Username or Email already exist').send()
            throw new InternalError('User could not be saved').send() 
        }
    }

    async updateUser(query: Partial<FullUser>, body:Partial<Omit<IReturnUser, 'id'>>){
        try{ await this.update(query, body) }
        catch(err:any){ throw new InternalError('Could not update user').send()  }

    }
}
