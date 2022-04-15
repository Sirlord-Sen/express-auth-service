import { IUser } from "./interfaces";

export type User = IUser

export type FullUser = Id & User & DateInfo

export type UpdateUser = Partial<Omit<User, 'id'>>

export type FilterUser = Partial<Omit<FullUser, 'password'>>

export type Password = { oldPassword: string, newPassword: string }