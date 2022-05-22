import { InternalServerError } from "@exceptions//"
import { verify } from "argon2"

export default {
    credentials: async (savedPassword: string, password: string): Promise<Boolean> => {
            try{return await verify(savedPassword, password)}
            catch(e){ throw new InternalServerError()}
    }
}
