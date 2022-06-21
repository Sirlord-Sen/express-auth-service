import { BullQueue } from "@lib/queue";
import { UserService } from "@modules/user/services/user.service";
import { User } from "@modules/user/user.types";
import { EmailQueue } from "@providers/mailer";
import { Redis } from "ioredis-mock";
import * as nock from "nock";
import { closeRedis, createRedisConnection } from "test/utils/cache";
import { closeDatabase, createDatabaseConnection } from "test/utils/database";
import { NewDummyUser } from "test/utils/dummy";
import { configureLogger } from "test/utils/logger";
import Container from "typedi";
import { Connection } from "typeorm";

// -------------------------------------------------------------------------
// Setup up
// -------------------------------------------------------------------------

let connection: Connection;
let redis: Redis;
let bullQueue: EmailQueue;
let userService: UserService;

beforeAll(async () => {
    configureLogger()
    redis = await createRedisConnection()
    bullQueue = Container.get<EmailQueue>(EmailQueue)
    connection = await createDatabaseConnection();
    userService = Container.get<UserService>(UserService)
});

// -------------------------------------------------------------------------
// Tear down
// -------------------------------------------------------------------------

afterAll(async() => {
    await bullQueue.close()
    closeRedis(redis);
    closeDatabase(connection)
    nock.cleanAll();
});

// -------------------------------------------------------------------------
// Test cases
// -------------------------------------------------------------------------

it("Register should return full user after user registration", async()=> {
    const body :User = {
        email: NewDummyUser().email,
        username: NewDummyUser().username,
        password: NewDummyUser().password
    }
    const resultUser = await userService.register(body);

    expect(resultUser.email).toBe(body.email)
    expect(resultUser.username).toBe(body.username)

    const foundUser = await userService.findOneOrFail({id: resultUser.id})

    expect(foundUser.email).toBe(body.email)
    expect(foundUser.username).toBe(body.username)
    return
})