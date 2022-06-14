import request from 'supertest';
import * as nock from 'nock';
import * as uuid from 'uuid';
import faker from 'faker';
import { BootstrapSettings } from '../utils/bootstrap';
import { UserEntity } from '../../../src/api/modules/user/entity'
import { CreateDummyUser } from '../../../src/database/seeds/dummy-user.seed'
import { prepareServer } from '../utils/server';
import { runSeeder } from 'typeorm-seeding';
import { closeDatabase } from '../../utils/database';
import { closeRedis } from '../../utils/cache';
import { Application } from 'express';
import { IDummyUser, IUpdateDummy, NewDummyUser, updateDummy } from '../utils/dummy';
import { ErrorType } from '../../../src/api/utils/utility-types'
import { signAccessJwt } from '../utils/jwt';


describe('/api/v1/users', () => {

    let newDummy: IDummyUser;
    let settings: BootstrapSettings;
    let app: Application;
    let dummy: UserEntity;
    let dummyAuthorization: string;
    let randomAuthorization: string;
    let updateUser: IUpdateDummy ;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async()=> {
        jest.setTimeout(10000)
        settings = await prepareServer();
        app = settings.app
        dummy = await runSeeder(CreateDummyUser);
        newDummy = NewDummyUser()
        dummyAuthorization = signAccessJwt({userId: dummy.id, email: dummy.email});
        randomAuthorization = signAccessJwt({userId: uuid.v4(), email: faker.internet.email()});
        updateUser = updateDummy()
    })


    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------
    
    afterAll(async () => {
        await closeDatabase(settings.connection);
        await closeRedis(settings.redis)
        nock.cleanAll();
    })

    // -------------------------------------------------------------------------
    // Signup User
    // -------------------------------------------------------------------------

    it('POST: / should return 200 & valid response for a valid signup request', async()=> {
        const res = await request(app)
                .post('/api/v1/users/')
                .send({...newDummy})
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe("New User Created")
       
    })

    it('POST: / should return 409 & valid response for a conflict error', async()=> {
        const res = await request(app)
                .post('/api/v1/users/')
                .send({
                    username: dummy.username,
                    password: "1234",
                    email: dummy.email
                })
        expect(res.status).toBe(409)
        expect(res.body.success).toBe(false)
        expect(res.body.error).toBe(ErrorType.CONFLICT)
        expect(res.body.message).toBe("user already exists")
       
    })

    it('POST: / should return 400 & valid response for a Bad Request Error', async()=> {
        const res = await request(app)
                .post('/api/v1/users/')
                .send({
                    password: "1234",
                    email: dummy.email
                })
        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.error).toBe(ErrorType.BADREQUEST)
    })

    // -------------------------------------------------------------------------
    // Get Current User
    // -------------------------------------------------------------------------

    it('GET: /:id should return 200 & valid response for Get current user route', async()=> {
        const res = await request(app)
                .get(`/api/v1/users/${dummy.id}`)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(200);

        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Current User Found')
        expect(res.body.data.user.id).toBe(dummy.id)
        expect(res.body.data.user.username).toBe(dummy.username)
        expect(res.body.data.user.email).toBe(dummy.email)
        expect(res.body.data.user.profile.firstname).toBe(dummy.profile.firstname)
        expect(res.body.data.user.profile.lastname).toBe(dummy.profile.lastname)
    })

    it('GET: /:id should return 401 & valid response for unauthorized user', async()=> {
        const res = await request(app)
                .get(`/api/v1/users/${dummy.id}`)
                .expect('Content-Type', /json/)
                .expect(401);

        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Unauthorized User')
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED)
    })

    it('GET: /:id should return 404 & valid response for NOT FOUND error', async()=> {
        const res = await request(app)
                .get(`/api/v1/users/${dummy.id}`)
                .set('Authorization', `Bearer ${randomAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(404);

        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('User not found')
        expect(res.body.error).toBe(ErrorType.NOTFOUND)
    })

    // -------------------------------------------------------------------------
    // Update User
    // -------------------------------------------------------------------------

    // This test has to come before actually updating a user.. Else, the user details will be updated
    it('PUT: /:id should return 200 & valid response for empty updating', async()=> {
        const res = await request(app)
                .put(`/api/v1/users/${dummy.id}`)
                .send({})
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Updated User');
        expect(res.body.data.user.id).toBe(dummy.id);
        expect(res.body.data.user.username).toBe(dummy.username);
        expect(res.body.data.user.email).toBe(dummy.email);
        expect(res.body.data.user.profile.firstname).toBe(dummy.profile.firstname);
        expect(res.body.data.user.profile.lastname).toBe(dummy.profile.lastname);
    })

    it('PUT: /:id should return 200 & valid response for updating user route', async()=> {
        const res = await request(app)
                .put(`/api/v1/users/${dummy.id}`)
                .send(updateUser)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Updated User');
        expect(res.body.data.user.id).toBe(dummy.id);
        expect(res.body.data.user.username).toBe(updateUser.username);
        expect(res.body.data.user.email).toBe(dummy.email);
        expect(res.body.data.user.profile.firstname).toBe(updateUser.profile.firstname);
        expect(res.body.data.user.profile.lastname).toBe(updateUser.profile.lastname);
        expect(res.body.data.user.profile.gender).toBe(updateUser.profile.gender);
    })


    it('PUT: /:id should return 404 & valid response for NOT FOUND error', async()=> {
        const res = await request(app)
                .put(`/api/v1/users/${dummy.id}`)
                .send(updateUser)
                .set('Authorization', `Bearer ${randomAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(404);

        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('User not found')
        expect(res.body.error).toBe(ErrorType.NOTFOUND)
    })


    it('PUT: /:id should return 401 & valid response for unauthorized user', async()=> {
        const res = await request(app)
                .put(`/api/v1/users/${dummy.id}`)
                .send(updateUser)
                .expect('Content-Type', /json/)
                .expect(401);

        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Unauthorized User')
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED)
    })


    // -------------------------------------------------------------------------
    // Change Password
    // -------------------------------------------------------------------------

    it('POST: /change-password should return 200 & valid response for updating pasword', async()=> {
        const updatePassword = {
            oldPassword: '1234',
            newPassword: '12345'
        }
        const res = await request(app)
                .post(`/api/v1/users/change-password`)
                .send(updatePassword)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(200);
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Password Changed Successfully');
        expect(res.body.data.user.id).toBe(dummy.id);
        expect(res.body.data.user.username).toBe(updateUser.username);
        expect(res.body.data.user.email).toBe(dummy.email);
        expect(res.body.data.user.profile.firstname).toBe(updateUser.profile.firstname);
        expect(res.body.data.user.profile.lastname).toBe(updateUser.profile.lastname);
        expect(res.body.data.user.profile.gender).toBe(updateUser.profile.gender);
    })

    it('POST: /change-password should return 401 & valid response for Wrong Pasword Entry', async()=> {
        const updatePassword = {
            oldPassword: '1234',
            newPassword: '12345'
        }
        const res = await request(app)
                .post(`/api/v1/users/change-password`)
                .send(updatePassword)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(401);
        
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Wrong Password');
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED)
    })

    it('POST: /change-password should return 409 & valid response for Same Password Entry', async()=> {
        const updatePassword = {
            oldPassword: '12345',
            newPassword: '12345'
        }
        const res = await request(app)
                .post(`/api/v1/users/change-password`)
                .send(updatePassword)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(409);
        
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Same Password');
        expect(res.body.error).toBe(ErrorType.CONFLICT)
    })

    it('POST: /change-password should return 401 & valid response for no bearer set', async()=> {
        const updatePassword = {
            oldPassword: '12345',
            newPassword: '1234'
        }
        const res = await request(app)
                .post(`/api/v1/users/change-password`)
                .send(updatePassword)
                .expect('Content-Type', /json/)
                .expect(401);
        
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized User');
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED)
    })

    it('POST: /change-password should return 400 & valid response for a Bad Request Error', async()=> {
        const updatePassword = {
            oldPassword: '12345',
        }
        const res = await request(app)
                .post(`/api/v1/users/change-password`)
                .send(updatePassword)
                .set('Authorization', `Bearer ${dummyAuthorization}`)
                .expect('Content-Type', /json/)
                .expect(400);
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.BADREQUEST)
    })

})
