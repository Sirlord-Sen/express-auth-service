import { Service } from "typedi"

import { EmailHelper } from "./"
import { EmailQueue } from "./"
import { DeployEmail, EmailRequest, QueueName } from "./email.types"
    
@Service()  
export abstract class EmailHandler{
    private emailQueue: EmailQueue
    constructor(
        public name: QueueName,
        public request: EmailRequest,
        public deploy: DeployEmail
    ){
        this.emailQueue = new EmailQueue()
    }
  
    protected async handler(email: EmailHandler){
        const { name ,request, deploy } = email
        return await this.emailQueue.addEmailToQueue({ name ,request, deploy})
    }
}
  
export class EmailConfirmAccount extends EmailHandler{
    constructor(request: EmailRequest){
      super(QueueName.CONFIRMACCOUNT, request, EmailHelper.confirmAccount(request))
      super.handler(this)
    }
}

export class EmailResetPassword extends EmailHandler{
    constructor(request: EmailRequest){
      super(QueueName.RESETPASSWORD ,request, EmailHelper.confirmResetPassword(request))
      super.handler(this)
    }
}