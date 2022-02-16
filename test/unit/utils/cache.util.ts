// /* eslint import/first: 0 */

// import faker from 'faker'

// import {RedisConfig} from '../../../src/config//' // to force test to use and mock'redis' rather than 'redis-mock'

// RedisConfig.url = 'redis://localhost:6379'

// import TokensCache  from '../../../src/utils/cache.util'

// import fst, {RedisStorageType} from '../lib/redis_storage'

// jest.mock('redis')


// beforeAll(async () => {
// 	// await TokensCache.open()
// })

// afterAll(async () => {
// 	// await TokensCache.closeToken()
// })

// afterEach(() => {
// 	fst.clear()
// })

// describe('setProp', () => {
// 	it('should reject with eror if redis.setex returns error', async () => {
//     const uuid = faker.datatype.uuid()
//     fst.addFailover(uuid, RedisStorageType.returnSet)
//     await expect(TokensCache.setProp(uuid, uuid, 60)).rejects.toThrowError()
//   })

//   it('should reject with eror if redis.setex callbacks with error', async () => {
//     const uuid = faker.datatype.uuid()
//     fst.addFailover(uuid, RedisStorageType.callbackSet)
//     await expect(TokensCache.setProp(uuid, uuid, 60)).rejects.toThrowError()
//   })
// })

// describe('getProp', () => {
// 	it('should reject with eror if redis.get returns error', async () => {
//     const uuid = faker.datatype.uuid()
//     fst.addFailover(uuid, RedisStorageType.returnGet)
//     await expect(TokensCache.getProp(uuid)).rejects.toThrowError()
//   })

//   it('should reject with eror if redis.get callbacks with error', async () => {
//     const uuid = faker.datatype.uuid()
//     fst.addFailover(uuid, RedisStorageType.callbackGet)
//     await expect(TokensCache.getProp(uuid)).rejects.toThrowError()
//   })
// })
