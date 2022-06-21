import { TokenService } from "@modules/auth/services/token.service";
import * as nock from "nock";
import * as uuid from "uuid"
import { closeDatabase, createDatabaseConnection } from "test/utils/database";
import { NewDummyUser } from "test/utils/dummy";
import { configureLogger } from "test/utils/logger";
import Container from "typedi";
import { Connection } from "typeorm";
import { UserEntity } from "@modules/user/entity";
import { runSeeder } from "typeorm-seeding";
import { CreateDummyUser } from "@database/seeds/dummy-user.seed";

// -------------------------------------------------------------------------
// Setup up
// -------------------------------------------------------------------------

let connection: Connection;
let tokenService: TokenService;
let dummy: UserEntity;

beforeAll(async () => {
    configureLogger()
    connection = await createDatabaseConnection();
    tokenService = Container.get<TokenService>(TokenService)
    dummy = await runSeeder(CreateDummyUser);
});

// -------------------------------------------------------------------------
// Tear down
// -------------------------------------------------------------------------

afterAll(async() => {
    closeDatabase(connection)
    nock.cleanAll();
});

// -------------------------------------------------------------------------
// Test cases
// -------------------------------------------------------------------------
describe('' ,() => {
    it("getTokens should return full token properties", async()=> { 
        const { id, email } = dummy
        const ctx: Context = {os: "Mac", browser: "Google Chrome"}
        const tokens = await tokenService.getTokens({id, email}, ctx);

        expect(tokens.tokenType).toBe("Bearer")
        expect(tokens.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(tokens.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(tokens.expiresAt instanceof Date).toBe(true);
        return
    })

    it("getTokens should return full token properties", async()=> { 
        const { email } = NewDummyUser()
        const ctx: Context = {os: "Mac", browser: "Google Chrome"}
        try{ await tokenService.getTokens({id: uuid.v4() , email}, ctx);}
        catch(e: any){ 
            expect(e.success).toBe(false)
            expect(e.status_code).toBe(500)
         }
    })
})
