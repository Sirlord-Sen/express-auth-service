import { hash } from 'argon2'
import { ValidateHelper } from "@helpers/"

describe("Validator Helper", ()=> {
    let hashed: string
    let password: string

    beforeEach(async()=> {
        password = "passwordDay"
        hashed = await hash(password);
    })

    it("Credentials returns true for correct hashed password verification", async()=>{
        const isVerified = await ValidateHelper.verifyPassword(hashed, password)

        expect(isVerified).toBe(true)
    })

    it("Credentials returns false for incorrect hashed password verification", async()=>{
        const isVerified = await ValidateHelper.verifyPassword(hashed, "password")

        expect(isVerified).toBe(false)
    })

})
