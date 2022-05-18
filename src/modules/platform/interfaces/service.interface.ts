import { FullUser, User } from "@modules/user/user.types"

export interface IPlatformService{
    create(body:User): Promise<Partial<FullUser>>
}