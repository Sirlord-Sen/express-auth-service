import { Response } from 'express'
import { LoginDto } from '../dto/auth.dto';


export interface AddAuthToResInterface {
    (res: Response, 
    accessToken: string, 
    refreshToken: string): void
  }

export interface ILogin extends LoginDto{}