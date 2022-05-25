import { FullUser, User } from "@user-module/user.types"

export interface IPlatformService{
    create(body:User): Promise<Partial<FullUser>>
}