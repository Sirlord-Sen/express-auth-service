import request from 'supertest'
import {Application} from 'express'

import CacheCore from '../../../src/core/cache.core'
import { DB } from '../../../src/db'
import ExpressServer from '../../../src/server'
import UserEntity from '../../../src/modules/user/entity/user.entity'

let server: Application
let user: UserEntity
const Cache = new CacheCore()

beforeAll(async () => {
    Cache
    await DB.on()
    server = new ExpressServer().app
})

afterAll(async () => {
    await Cache.close()
    try{await DB.close()}
    catch(err){ expect(err).toMatch('error'); }
})



describe('POST /api/v1/users', () => {

    it('should return 200 & valid response for a valid signup request', async()=> {
        const user = {
            username: "demdemdem",
            password: "123",
            email: "lodwaf12@gmail.com"
        }
        const res = await request(server)
                .post('/api/v1/users/')
                .send({...user})
                .expect(200)
        
        expect(res.body.data.username).toBe(user.username)
       
    })

    // it('should return 409 & valid response for duplicated user', async() => {
    //     const user = await createDummy()
    //     const res = await request(server)
    //                             .post('/api/v1/users/register')
    //                             .send({...user})
    //     expect(res.status).toBe(409)
    //     expect(res.body).toMatchObject({
    //         program: expect.stringMatching("stud-aid microservice"),
    //         version: expect.stringMatching("v1"),
    //         release: expect.stringMatching("1.2.1"),
    //         datetime: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
    //         success: false,
    //         error: expect.stringMatching("ConflictError"),
    //         message: expect.stringMatching("Username or Email already exist"),
    //         data: {}
    //     })
    // })

    // it('should return 400 & valid response for Bad Request creation',async () => {
    //     const user = dummy()
    //     const { username, email, firstname,surname, password} = user
    //     const res = await request(server)
    //                             .post('/api/v1/users/register')
    //                             .send({
    //                                 username,
    //                                 email: 'lodwaf',
    //                                 firstname,
    //                                 surname,
    //                                 password
    //                             })
    //     expect(res.status).toBe(400)
    // })


})