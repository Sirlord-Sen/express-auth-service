import argon2 from 'argon2'
import { IReturnUser, IUser } from '../interfaces/user.interface'
import { pick } from 'lodash'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository/user.repository'
import { InternalError } from '../../common/middlewares/error.middleware'

export default class UserService {
    public userRepository: UserRepository
    constructor(){
        this.userRepository = getCustomRepository(UserRepository)
    }

    async register(data: IUser): Promise<IReturnUser>{
        try{
            const { username, firstname, surname, email, password } = data

            const foundUser = await this.userRepository.findOne({email})
            if (foundUser) throw new InternalError("User already exist").send()
            const hashedPassword = await argon2.hash(password)

            const newUser = await this.userRepository.createUser({username, firstname, surname, email, password: hashedPassword})
            const savedUser = pick(newUser, ["id", "username", "email", "firstname", "surname"])
            return savedUser
        }
        catch(err){ throw err }
    }
}