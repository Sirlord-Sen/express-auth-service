import { Service } from "typedi"
import { EmailHelper } from "."
import { EmailQueue } from "./"
import { EmailRequest } from "./email.types"

export enum EmailOcassion {
    CONFIRM_ACCOUNT = 'confirm_account',
    FORGOT_PASSWORD = 'forgot_password'
  }
    
@Service()  
export abstract class EmailThings{
    private emailQueue: EmailQueue
    constructor(
        public type: EmailOcassion,
        public request: EmailRequest,
    ){
        this.emailQueue = new EmailQueue
    }
  
    protected async emailHandler(email: EmailThings){
        const { request, type } = email
        let deploy
        switch(type){
            case EmailOcassion.CONFIRM_ACCOUNT:
                deploy = EmailHelper.confirmAccount(request)
                return await this.emailQueue.addEmailToQueue({request, deploy})
            
            case EmailOcassion.FORGOT_PASSWORD:
                deploy = EmailHelper.confirmResetPassword(request)
                return await this.emailQueue.addEmailToQueue({request, deploy})
        }
    }
}
  
export class EmailConfirmAccount extends EmailThings{
    constructor(request: EmailRequest){
      super(EmailOcassion.CONFIRM_ACCOUNT, request)
      super.emailHandler(this)
    }
}

export class EmailResetPassword extends EmailThings{
    constructor(request: EmailRequest){
      super(EmailOcassion.FORGOT_PASSWORD, request)
      super.emailHandler(this)
    }
}