import { pick } from 'lodash'
import { FilterUser, UpdateUser, User } from '../user.types'
import { UserRepository } from '../repository/user.repository'
import { ConflictError, NotFoundError, UnauthorizedError } from '@exceptions//'
import { FullUser, Password } from '../user.types'
import { IUserService } from '../interfaces/service.interface'
import { ValidateHelper } from '@helpers//'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { nanoid } from 'nanoid'
import { TokenService } from '@auth/services/token.service'
import { EmailConfirmAccount } from '@providers/mailer/email.util'

@Service()
export class UserService implements IUserService{
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ){}

    async register(data: User){
        let user = await this.userRepository.createUser(data)
        const { id, email } = user
        const accountActivationToken = nanoid();
        const {accessToken, expiredAt} = await this.tokenService.generateAccessToken({userId: id, email}, accountActivationToken)
        await this.update({ id }, { accountActivationToken, accountActivationExpires: expiredAt });
        new EmailConfirmAccount({ token: accessToken, email })
        return user
    }

    async findCurrentUser(data: Partial<FullUser>){
        const user = await this.findOneOrFail(data)
        return pick(user, ["id", "username", "email", "profile"])
    }
    
    async findOneOrFail(query: FilterUser){
        try{ return await this.userRepository.findOneOrFail({ where: query });}
        catch(err){ throw new NotFoundError("User not found") }
    }

    async findOne(query: FilterUser) {
        return await this.userRepository.findOne(query);
    }

    async update(query: FilterUser, body: UpdateUser){
        const user = await this.userRepository.updateUser(query, body)
        return pick(user, ["id", "username", "email", "profile"])
    }

    async updatePassword(query: Partial<FullUser>, body: Password){
        const { oldPassword, newPassword } = body
        const user = await this.findOneOrFail(query)
        if(!await ValidateHelper.credentials(user.password, oldPassword)) throw new UnauthorizedError("Wrong Password")
        if(await ValidateHelper.credentials(user.password, newPassword)) throw new ConflictError("Same Password")
        return await this.update(query, {password: newPassword})
    }
}