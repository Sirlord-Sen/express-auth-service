import UserService from "../../user/services/user.service";
import { ILogin } from "../interfaces/auth.interface";
import { UnauthorizedError } from "../../../utils/error-response.util";
import { pick } from "lodash";
import { IReturnUser } from "../../user/interfaces/user.interface";
import { LogoutRequest, TokenRequest } from "../auth.types";
import { TokenService } from ".";
import { IRefreshTokenRequest, ITokenResponse } from "../interfaces/token.interface";
import { TokenType } from "../../../utils/util-types";


export default class AuthService {
    private userService: UserService 
    private tokenService: TokenService

    constructor(){
         this.userService = new UserService()
         this.tokenService = new TokenService()
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

    async logout(body:LogoutRequest): Promise<void>{
        const { userId } = body
        await this.tokenService.update({ userId } , {isRevoked: true });
    }

    async refreshToken(body: IRefreshTokenRequest): Promise<ITokenResponse>{
        let { user }  = await this.tokenService.resolveRefreshToken(body.refreshToken)
        const accessToken = await this.tokenService.generateAccessToken({userId: user.id, email: user.email})
        const tokens = { tokenType: TokenType.BEARER , accessToken, refreshToken: body.refreshToken }
        return  tokens ;
    }
}