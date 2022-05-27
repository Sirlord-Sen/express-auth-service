import { IPlatform } from '@platform-module/interfaces';
import { IProfile } from './profile.interface';

export interface IUser {
    username: string
    email: string;
    password?: string;
    isActive?: boolean;
    isAccountActivated?: boolean
    accountActivationToken?: string;
    accountActivationExpires?: Date 
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    profile?: IProfile;
    platform?: IPlatform
}
