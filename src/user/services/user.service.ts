import argon2 from 'argon2'
import { pick } from 'lodash'
import { getConnection } from 'typeorm'
import { UserRepository } from '../repository/user.repository'
import { SignUpDto, UserPayloadDto } from '../dto/user.dto'
import { InternalError } from '../../common/middlewares/error.middleware'
import {response} from 'express'

export class UserService {
    public userRepository: UserRepository
    // public logger = new Logger()
    constructor(){
        this.userRepository = getConnection().getCustomRepository(UserRepository)
    }

    async register(data:SignUpDto): Promise<UserPayloadDto>{
        try{
            const { username, firstname, surname, email, password } = data

            const foundUser = await this.userRepository.findOne({email})
            if (foundUser) throw new InternalError("User already exist").send()
            const hashedPassword = await argon2.hash(password)

            const newUser = this.userRepository.create({username, firstname, surname, email, password: hashedPassword})
            const savedUser = pick(await this.userRepository.save(newUser), ["id", "username", "email", "firstname", "surname"])
            return savedUser
        }
        catch(err){ throw err }
    }
}