import { PayloadDto } from '../../common/dto/payload.dto'
import { UserPayloadDto } from '../../user/dto/user.dto'


export class AuthPayloadDto extends PayloadDto{
    data: UserPayloadDto
}