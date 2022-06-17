import { InternalServerError } from "@exceptions//"
import { verify } from "argon2"

export default {
    verifyPassword: async (hashedPassword: string, password: string): Promise<boolean> => {
            try{return await verify(hashedPassword, password)}
            catch(e){ throw new InternalServerError()}
    }
}
