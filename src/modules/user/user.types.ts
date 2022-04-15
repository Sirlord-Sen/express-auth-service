type Password= {
    password: string
}
export type FullUser = IReturnUser & Password

export interface IReturnUser {
    id: string;
    username: string;
    email: string;
    firstname: string;
    surname: string;
    confirmTokenPassword?:string
}

export interface UserPayloadInterface{
    user: IReturnUser
}

export interface IPassword{
    oldPassword: string,
    newPassword: string
}