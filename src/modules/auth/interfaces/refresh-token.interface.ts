import { IUser } from "@user/interfaces";

export interface IRefreshToken {
    browser?: string;
    expiredAt: Date;
    ip?: string;
    isRevoked?: boolean;
    jti: string;
    os?: string;
    user?: IUser;
    userAgent?: string;
    userId: string;
}