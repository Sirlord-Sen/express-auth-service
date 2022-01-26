import { PayloadDto } from '../../common/dto/payload.dto'
import { AuthPayloadInterface } from '../interfaces/auth.interface'


export class AuthPayloadDto extends PayloadDto{
    data: AuthPayloadInterface
}