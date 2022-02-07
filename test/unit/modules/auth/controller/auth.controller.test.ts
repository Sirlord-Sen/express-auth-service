import request from 'supertest'
import { DB } from  '../../../../../src/db' 
import ExpressServer  from '../../../../../src/server'
import { Application } from 'express'

let server: Application
beforeAll( async () => {
    await DB.on()
    server =  new ExpressServer().app
})

afterAll(async () => {
  await DB.close()
})

describe('POST /api/auth/login', () => {
    it('should return simple user', (done): void => {
      const dummy = {
          email: "lodwaf12@gmail.com",
          password: "I love God."
      }
      request(server)
        .post('/api/auth/login')
        .send({
            email: dummy.email,
            password: dummy.password
        })
        .expect(200)
        .end((err, res)=> {
            if(err) return done(err)
            expect(res.body).toMatchObject({
                Id: "ad810334-0b46-4e79-bb35-5e5ef86c1dd1",
                email: "lodwaf12@gmail.com"
            })
            done()
        })
    })
})
