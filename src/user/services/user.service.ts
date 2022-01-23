import { User } from '../entity/user.entity'
import { getConnection } from 'typeorm'
import { UserRepository } from '../repository/user.repository'
import { SignUpDto, UserPayloadDto } from '../dto/user.dto'

export class UserService {
    public userRepository: UserRepository
    // public logger = new Logger()
    constructor(){
        this.userRepository = getConnection().getCustomRepository(UserRepository)
    }

    async signup(user:SignUpDto): Promise<UserPayloadDto>{
        try{
            const post = user as User
            const saved = await this.userRepository.save(post)
            delete saved.password
            return saved
        }
        catch(err){
            throw err
        }
    }
}