import { verify } from "argon2"

export default {
    credentials: async (savedPassword: string, password: string): Promise<Boolean> => {
            return await verify(savedPassword, password)
    }
}
