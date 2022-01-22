import { User } from '../entity/user.entity'
import { Repository,getManager, getConnection } from 'typeorm'
import { UserRepository } from '../repository/user.repository'

export class UserService {
    public userRepository: UserRepository
    // public logger = new Logger()
    constructor(){
        this.userRepository = getConnection().getCustomRepository(UserRepository)
    }

    async signup(user:any){
        const post = user as User
        const saved = await this.userRepository.save(post)
        return ({
            "message": "success",
            "payload" : {
                "name": saved.firstname,
                "email": saved.email
            }
        })
    }
}