import { pick } from 'lodash'
import { getCustomRepository } from 'typeorm'
import { FilterUser, UpdateUser, User } from '../user.types'
import { UserRepository } from '../repository/user.repository'
import { NotFoundError, UnauthorizedError } from '@utils/error-response.util'
import { FullUser, Password } from '../user.types'
import { AuthService } from '@modules/auth/services'
import { IUserService } from '../interfaces/service.interface'
import { ValidateHelper } from '@helpers//'

export default class UserService implements IUserService{
    private userRepository: UserRepository
    private authService: AuthService
    constructor(){
        this.userRepository = getCustomRepository(UserRepository)
        this.authService = new AuthService()
    }

    async register(data: User){
        const newUser = await this.userRepository.createUser(data)
        return pick(newUser, ["id", "username", "email", "firstname", "surname"])
    }

    async findCurrentUser(data: Partial<FullUser>){
        const user = await this.findOneOrFail(data)
        return pick(user, ["id", "username", "email", "firstname", "surname"])
    }
    
    async findOneOrFail(query: FilterUser){
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw new NotFoundError("User not found").send() }
    }

    async update(query: FilterUser, body: UpdateUser){
        const user = await this.userRepository.updateUser(query, body)
        return pick(user, ["id", "username", "email", "firstname", "surname"])
    }

    async updatePassword(query: Partial<FullUser>, body: Password){
        const { oldPassword, newPassword } = body
        const user = await this.findOneOrFail(query)
        const validate = await ValidateHelper.credentials(user.password, oldPassword)
        if(!validate) throw new UnauthorizedError("Wrong Password").send()
        return await this.update(query, {password: newPassword})
    }
}