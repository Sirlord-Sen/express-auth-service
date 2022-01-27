import { EntityRepository, Repository } from 'typeorm'
import { InternalError } from '../../common/middlewares/error.middleware';
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
        catch (err) { throw new InternalError('User could not be saved') }
      }
}
