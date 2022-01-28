import UserService from "../../user/services/user.service";
import { ILogin } from "../interfaces/auth.interface";
import { UnauthorizedError } from "../../../utils/error-response.util";
import { pick } from "lodash";
import { IReturnUser } from "../../user/interfaces/user.interface";


export default class AuthService {
    private userService: UserService 

    constructor(){
         this.userService = new UserService()
    }

    async login(body:ILogin): Promise<IReturnUser>{
        try{
            const { email, password } = body
            const user = await this.userService.findOne({email})
            const validateCredentials = await this.userService.validateLoginCredentials(user, password)

            if(!validateCredentials){ throw new UnauthorizedError("Invalid Login Credentials").send() }
            return pick(user, ["id", "username", "email", "firstname", "surname"])
        }
        catch(err){throw err}
    }
}