import { EmailRequest, DeployEmail } from "./email.types"

export default (() => {
    const confirmAccount = (data: EmailRequest): DeployEmail => {
        const { token, email } = data
        return {
            subject: token ? 'Confirm Account' : 'Your Account Has Been Created',
            html: token ? 
                'You are receiving this because you (or someone else) have requested to reset your account password.\n\n' +
                'To change password, kindly use the token below\n\n' + token +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                : 'Hello,\n\n' + 'This is a confirmation that the password to your account with email ' +
                email + ' has just been changed.\n'
            }
    }

    const confirmResetPassword = (data: EmailRequest): DeployEmail => {
        const { token } = data
        return {
            subject: token ? 'Password Reset' : 'Your password has been changed',
            html: token ? 
                'You are receiving this because you (or someone else) have requested to change password' + 
                'To activate account, kindly use the token below\n\n' + token  +
                'If you did not request this, please ignore this email\n'
                : 'Hello,\n\n' + 'This is a confirmation that you have created an account with StudAid.\n'
        }
    }

    return {
        confirmAccount,
        confirmResetPassword
    }
})()