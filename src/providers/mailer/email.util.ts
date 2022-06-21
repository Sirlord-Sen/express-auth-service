import { Service } from "typedi"

import { EmailHelper } from "./"
import { EmailQueue } from "./"
import { DeployEmail, EmailRequest, QueueName } from "./email.types"
    
@Service()  
export abstract class EmailHandler{
    public emailQueue: EmailQueue
    constructor(
        public request: EmailRequest,
        public deploy: DeployEmail
    ){
        this.emailQueue = new EmailQueue()
    }
  
    protected async handler(email: EmailHandler){
        const { request, deploy } = email
        return await this.emailQueue.addEmailToQueue({ request, deploy })
    }
}
  
export class EmailConfirmAccount extends EmailHandler{
    constructor(request: EmailRequest){
        EmailQueue.queue_name = QueueName.CONFIRMACCOUNT
        super(request, EmailHelper.confirmAccount(request))
        super.handler(this)
    }
}

export class EmailResetPassword extends EmailHandler{
    constructor(request: EmailRequest){
        EmailQueue.queue_name = QueueName.RESETPASSWORD
        super(request, EmailHelper.confirmResetPassword(request))
        super.handler(this)
    }
}