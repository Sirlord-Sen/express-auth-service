import { IReturnUser, IUser } from '../interfaces/user.interface'
import { verify } from 'argon2'
import { pick } from 'lodash'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository/user.repository'
import { NotFoundError, UnauthorizedError } from '../../../utils/error-response.util'
import { ILogin } from '../../auth/interfaces/auth.interface'
import { FullUser } from '../user.types'
import UserEntity from '../entity/user.entity'

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

    async findOne(query: Partial<FullUser>): Promise<UserEntity>{
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw new NotFoundError("User not found").send() }
    }

    async update(query: Partial<FullUser>, body: Partial<Omit<FullUser, 'id'>>) {
        await this.userRepository.updateUser(query, body)
    }

    async validateLoginCredentials(user: Pick<ILogin, 'password'>, password: string):Promise<Boolean>{
        try{return await verify(user.password, password)}
        catch(err){throw new UnauthorizedError("Invalid Login Credentials").send()}
    }
}