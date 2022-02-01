import { IReturnUser } from "./interfaces/user.interface";

type Password= {
    password: string
}
export type FullUser = IReturnUser & Password