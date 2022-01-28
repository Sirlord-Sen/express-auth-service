import { EntityRepository, Repository } from 'typeorm'
import { InternalError, ConflictError } from '../../../utils/error-response.util';
import UserEntity from '../entity/user.entity'
import { IUser } from '../interfaces/user.interface';

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
}
