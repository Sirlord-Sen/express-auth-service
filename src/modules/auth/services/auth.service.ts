import UserService from "../../user/services/user.service";
import { ILogin } from "../interfaces/auth.interface";
import { UnauthorizedError } from "../../../utils/error-response.util";
import { pick } from "lodash";
import { IReturnUser } from "../../user/interfaces/user.interface";
import { ForgotPasswordRequest, LogoutRequest, ResetPasswordRequest } from "../auth.types";
import { TokenService } from ".";
import { IRefreshTokenRequest, ITokenResponse } from "../interfaces/token.interface";
import { TokenType } from "../../../utils/util-types";
import { nanoid } from "nanoid";
import EmailQueue  from "../../../providers/mailer";


export default class AuthService {
    private userService: UserService 
    private tokenService: TokenService
    private emailQueue : EmailQueue

    constructor(){
         this.userService = new UserService()
         this.tokenService = new TokenService()
         this.emailQueue = new EmailQueue()
    }

    async login(body:ILogin): Promise<IReturnUser>{
        try{
            const { email, password } = body
            const user = await this.userService.findOne({email})
            const validate = await this.userService.validateLoginCredentials(user, password)
            if(!validate) throw new UnauthorizedError("Invalid Login Credentials").send()
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

    // FIX
    // SET EXPIRY FOR CONFIRMTOKENPASSWORD TO BE CLEARED FROM DATABASE AFTER EXPIRY
    async forgotPassword(body: ForgotPasswordRequest): Promise<IReturnUser> {
        const { email } = body;
        const { id } = await this.userService.findOne({ email });

        const confirmTokenPassword = nanoid();
        const token = await this.tokenService.generateAccessToken({userId: id, email}, confirmTokenPassword)

        const user = await this.userService.update({ id }, { confirmTokenPassword });
        await this.emailQueue.addForgotPasswordToQueue({ token, email });
        return user
    }

    async resetPassword(body: ResetPasswordRequest): Promise<IReturnUser> {
        const { password, token } = body
        const { jti, email } = await this.tokenService.decodeAccessToken(token)

        const user = await this.userService.update({email, confirmTokenPassword: jti}, {password: password})
        await this.emailQueue.addForgotPasswordToQueue({ email });
        return user
    }
}