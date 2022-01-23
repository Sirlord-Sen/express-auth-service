import { UserPayloadDto } from "../../user/dto/user.dto";

class DataDto{
    user: UserPayloadDto
}

export class AuthPayloadInterface{
    data: DataDto
}