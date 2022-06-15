import * as uuid from 'uuid';
import * as nock from 'nock';
import { closeRedis, createRedisConnection } from 'test/utils/cache';
import { Redis } from 'ioredis-mock';
import { TokensCache as TokenCacheInstance} from '@providers/cache';
import { TokensCache } from '@providers/cache/cache';


describe('JWTService', () => {
    let redis: Redis
    let tokenCache: TokensCache

    beforeAll(async () => {
        redis  = await createRedisConnection()
        tokenCache = TokenCacheInstance
    });

    afterAll(async () => {
        await closeRedis(redis)
        nock.cleanAll();
    })

    it("blah blah", async() => {
        const proper = await tokenCache.setProp("asdfghjasdfghjasdfghjk", "This is secret", 2333)
        console.log(proper)
    })

});