import { IProfile } from './profile.interface';

export interface IUser {
    username: string
    email: string;
    isActive: boolean;
    password: string;
    profile?: IProfile;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    accountActivationToken?: string;
    accountActivationExpires?: Date 
}
