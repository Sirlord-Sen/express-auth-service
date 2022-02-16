import request from 'supertest'
import {Application} from 'express'

import CacheCore from '../../../../../src/core/cache.core'
import { DB } from '../../../../../src/db'
import ExpressServer from '../../../../../src/server'
import { createDummy, dummy } from '../../../helpers/user'


let server: Application
beforeAll(async () => {
    // new CacheCore()
    await DB.on()
    server = new ExpressServer().app
})

afterAll(async () => {
    // await new CacheCore().close()
    try{await DB.close()}
    catch(err){ expect(err).toMatch('error'); }
})

describe('POST /api/user/register', () => {
    it('should return 200 & valid response for a valid signup request', async()=> {
        const user = dummy()
        const { username, email, firstname,surname } = user
        const res = await request(server)
                                .post('/api/user/register')
                                .send({...user})
        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
                    program: expect.stringMatching("stud-aid microservice"),
                    version: expect.stringMatching("v1"),
                    release: expect.stringMatching("1.2.1"),
                    datetime: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
                    success: true,
                    message: expect.stringMatching("New User Created"),
                    data: {
                        user: {
                            id: expect.stringMatching(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
                            username: expect.stringMatching(username),
                            email: expect.stringMatching(email),
                            firstname: expect.stringMatching(firstname),
                            surname: expect.stringMatching(surname)
                        }
                    }
        })
    })

    it('should return 409 & valid response for duplicated user', async() => {
        const user = await createDummy()
        const res = await request(server)
                                .post('/api/user/register')
                                .send({...user})
        expect(res.status).toBe(409)
        expect(res.body).toMatchObject({
            program: expect.stringMatching("stud-aid microservice"),
            version: expect.stringMatching("v1"),
            release: expect.stringMatching("1.2.1"),
            datetime: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
            success: false,
            error: expect.stringMatching("ConflictError"),
            message: expect.stringMatching("Username or Email already exist"),
            data: {}
        })
    })

    it('should return 400 & valid response for Bad Request creation',async () => {
        const user = dummy()
        const { username, email, firstname,surname, password} = user
        const res = await request(server)
                                .post('/api/user/register')
                                .send({
                                    username,
                                    email: 'lodwaf',
                                    firstname,
                                    surname,
                                    password
                                })
        expect(res.status).toBe(400)
    })


})