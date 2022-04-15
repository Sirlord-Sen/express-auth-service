import { pick } from 'lodash'
import { FilterUser, UpdateUser, User } from '../user.types'
import { UserRepository } from '../repository/user.repository'
import { NotFoundError, UnauthorizedError } from '@utils/error-response.util'
import { FullUser, Password } from '../user.types'
import { IUserService } from '../interfaces/service.interface'
import { ValidateHelper } from '@helpers//'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'

@Service()
export default class UserService implements IUserService{
    
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository
    ){}

    async register(data: User){
        const newUser = await this.userRepository.createUser(data)
        return pick(newUser, ["id", "username", "email"])
    }

    async findCurrentUser(data: Partial<FullUser>){
        const user = await this.findOneOrFail(data)
        return pick(user, ["id", "username", "email"])
    }
    
    async findOneOrFail(query: FilterUser){
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw new NotFoundError("User not found") }
    }

    async update(query: FilterUser, body: UpdateUser){
        const user = await this.userRepository.updateUser(query, body)
        return pick(user, ["id", "username", "email"])
    }

    async updatePassword(query: Partial<FullUser>, body: Password){
        const { oldPassword, newPassword } = body
        const user = await this.findOneOrFail(query)
        const validate = await ValidateHelper.credentials(user.password, oldPassword)
        if(!validate) throw new UnauthorizedError("Wrong Password")
        return await this.update(query, {password: newPassword})
    }
}