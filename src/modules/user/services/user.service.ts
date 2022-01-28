import { IReturnUser, IUser } from '../interfaces/user.interface'
import { verify } from 'argon2'
import { pick } from 'lodash'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository/user.repository'
import { NotFoundError } from '../../../utils/error-response.util'
import { ILogin } from '../../auth/interfaces/auth.interface'

export default class UserService {
    public userRepository: UserRepository
    constructor(){
        this.userRepository = getCustomRepository(UserRepository)
    }

    async register(data: IUser): Promise<IReturnUser>{
        try{
            const newUser = await this.userRepository.createUser(data)
            return pick(newUser, ["id", "username", "email", "firstname", "surname"])
        }
        catch(err){ throw err }
    }

    async findOne(query: Partial<IReturnUser>){
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw new NotFoundError("User not found").send() }
    }

    validateLoginCredentials(user: Pick<ILogin, 'password'>, password: string){
        return user.password ? verify(user.password, password) : false;
    }
}