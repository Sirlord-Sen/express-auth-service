import { FilterUser, FullUser, Password, UpdateUser, User } from "../user.types";

export interface IUserService{
    register(body: User): Promise<Partial<FullUser>>
    findCurrentUser(data: Partial<FullUser>): Promise<Partial<FullUser>>
    findOneOrFail(query: FilterUser): Promise<FullUser>
    findOne(query: FilterUser): Promise<FullUser | undefined>
    update(query: FilterUser, body: UpdateUser): Promise<Partial<FullUser>>
    updatePassword(query: Partial<FullUser>, body: Password): Promise<Partial<FullUser>>
}