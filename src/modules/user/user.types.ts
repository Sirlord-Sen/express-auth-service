import { IUser } from "./interfaces";

export type User = IUser

export type FullUser = Id & User & DateInfo

export type Password = { oldPassword: string, newPassword: string }