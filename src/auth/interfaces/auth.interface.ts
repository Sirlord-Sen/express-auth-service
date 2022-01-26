import { UserPayloadDto } from "../../user/dto/user.dto";
import { Response } from 'express'

export interface AuthPayloadInterface{
    user: UserPayloadDto
}

export interface AddAuthToResInterface {
    (res: Response, 
    accessToken: string, 
    refreshToken: string): void
  }