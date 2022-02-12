import UserService from "@modules/user/services/user.service";
import { ILogin } from "../interfaces/auth.interface";
import { InternalError, UnauthorizedError } from "@utils/error-response.util";
import { pick } from "lodash";
import { IReturnUser } from "@modules/user/interfaces/user.interface";
import { ForgotPasswordRequest, LogoutRequest, ResetPasswordRequest } from "../auth.types";
import { TokenService } from ".";
import { IRefreshTokenRequest, ITokenResponse } from "../interfaces/token.interface";
import { TokenType } from "@utils/util-types";
import { nanoid } from "nanoid";
import EmailQueue  from "@providers/mailer";


export default class AuthService {
    private userService: UserService 
    private tokenService: TokenService
    private emailQueue : EmailQueue

    constructor(){
        this.emailQueue = new EmailQueue()
        this.userService = new UserService()
        this.tokenService = new TokenService()
    }

    async login(body:ILogin): Promise<IReturnUser>{
        const { email, password } = body
        const user = await this.userService.findOne({email})
        const validate = await this.userService.validateLoginCredentials(user, password)
        if(!validate) throw new UnauthorizedError("Invalid Login Credentials").send()
        return pick(user, ["id", "username", "email", "firstname", "surname"])      
    }

    async logout(body:LogoutRequest): Promise<void>{
        const { userId } = body
        await this.tokenService.update({ userId } , {isRevoked: true });
    }

    async refreshToken(body: IRefreshTokenRequest): Promise<ITokenResponse>{
        let { user }  = await this.tokenService.resolveRefreshToken(body.refreshToken)
        const { accessToken, expiredAt } = await this.tokenService.generateAccessToken({userId: user.id, email: user.email})
        const tokens = { tokenType: TokenType.BEARER , accessToken, expiredAt, refreshToken: body.refreshToken }
        return  tokens ;
    }

    // FIX
    // SET EXPIRY FOR CONFIRMTOKENPASSWORD TO BE CLEARED FROM DATABASE AFTER EXPIRY
    async forgotPassword(body: ForgotPasswordRequest): Promise<IReturnUser> {
        const { email } = body;
        const { id } = await this.userService.findOne({ email });

        const confirmTokenPassword = nanoid();
        const { accessToken } = await this.tokenService.generateAccessToken({userId: id, email}, confirmTokenPassword)

        const user = await this.userService.update({ id }, { confirmTokenPassword });

        await this.emailQueue.addForgotPasswordToQueue({ token: accessToken, email })
        return user
        
    }

    async resetPassword(body: ResetPasswordRequest): Promise<IReturnUser> {
        const { password, token } = body
        const { jti, email } = await this.tokenService.decodeForgotPasswordToken(token)

        const user = await this.userService.update({email, confirmTokenPassword: jti}, {password: password})
        await this.emailQueue.addForgotPasswordToQueue({ email })
     
        return user
    }
}