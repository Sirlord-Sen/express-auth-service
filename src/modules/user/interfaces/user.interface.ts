export interface IUser {
    username: string;
    email: string;
    firstname: string;
    surname: string;
    password: string;
}

export interface IReturnUser {
    id: string;
    username: string;
    email: string;
    firstname: string;
    surname: string;
}

export interface UserPayloadInterface{
    user: IReturnUser
}
