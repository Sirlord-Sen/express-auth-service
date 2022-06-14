import request from 'supertest';
import * as nock from 'nock';
import * as uuid from 'uuid';
import faker from 'faker';
import { BootstrapSettings } from '../utils/bootstrap';
import { UserEntity } from '../../../src/api/modules/user/entity'
import { CreateDummyUser } from '../../../src/database/seeds/dummy-user.seed'
import { CreateDummyRefreshToken } from '@database/seeds/dummy-refreshToken.seed';
import { prepareServer } from '../utils/server';
import { runSeeder } from 'typeorm-seeding';
import { closeDatabase } from '../../utils/database';
import { closeRedis } from '../../utils/cache';
import { Application } from 'express';
import { IDummyUser, NewDummyUser } from '../utils/dummy';
import { signAccessJwt, signRefreshJwt } from '../utils/jwt';
import { ErrorType } from '@utils/utility-types';
import { RefreshTokenEntity } from '@modules/auth/entity';


describe('POST /api/v1/auth', () => {

    let newDummy: IDummyUser;
    let settings: BootstrapSettings;
    let app: Application;
    let dummy: UserEntity;
    let dummyTwo: UserEntity;
    let dummyRefreshToken: RefreshTokenEntity;
    let randomAuthorization: string;
    let confirmAccounttoken: string;
    let forgotPasswordToken: string;
    let refreshTokenToBeRevoked: string;
    let refreshToken: string;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async()=> {
        jest.setTimeout(10000)
        settings = await prepareServer();
        app = settings.app;
        dummy = await runSeeder(CreateDummyUser);
        dummyTwo = await runSeeder(CreateDummyUser);
        CreateDummyRefreshToken.userId = dummy.id
        dummyRefreshToken = await runSeeder(CreateDummyRefreshToken);
        newDummy = NewDummyUser();
        refreshToken = signRefreshJwt({userId: dummyRefreshToken.userId, jti: dummyRefreshToken.jti})
        confirmAccounttoken = signAccessJwt({userId: dummy.id, email: dummy.email, token: dummy.accountActivationToken});
        forgotPasswordToken = signAccessJwt({userId: dummyTwo.id, email: dummyTwo.email, token: dummyTwo.passwordResetToken})
        randomAuthorization = signAccessJwt({userId: uuid.v4(), email: faker.internet.email()});
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
    // Confirm Account User
    // -------------------------------------------------------------------------

    it('POST: /confirm-account should return 200 & valid response for confirm account', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/confirm-account/')
                    .send({ token : confirmAccounttoken})
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User Account Verified");
        expect(res.body.data.user.id).toBe(dummy.id);
        expect(res.body.data.user.email).toBe(dummy.email);
        expect(res.body.data.user.username).toBe(dummy.username);
        expect(res.body.data.tokens.tokenType).toBe("Bearer");
        expect(res.body.data.tokens.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.expiresAt).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        refreshTokenToBeRevoked = res.body.data.tokens.refreshToken;
    })


    it('POST: /confirm-account should return 404 & valid response for wrong token', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/confirm-account/')
                    .send({ token: randomAuthorization})
                    .expect(404)
   
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");
        expect(res.body.error).toBe(ErrorType.NOTFOUND)
    })


    // -------------------------------------------------------------------------
    // Login User
    // -------------------------------------------------------------------------


    it('POST: /login should return 200 & valid response user login', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/login/')
                    .send({
                        email: dummy.email,
                        password: "1234"
                    })
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login Successfull");
        expect(res.body.data.user.id).toBe(dummy.id);
        expect(res.body.data.user.email).toBe(dummy.email);
        expect(res.body.data.user.username).toBe(dummy.username);
        expect(res.body.data.tokens.tokenType).toBe("Bearer");
        expect(res.body.data.tokens.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.expiresAt).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        refreshTokenToBeRevoked = res.body.data.tokens.refreshToken;
    })

    it('POST: /login should return 401 & valid response wrong password entry', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/login/')
                    .send({
                        email: dummy.email,
                        password: "123"
                    })
                    .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED);
        expect(res.body.message).toBe("Invalid Login Credentials");
    })

    it('POST: /login should return 404 & valid response unregistered user', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/login/')
                    .send({
                        email: newDummy.email,
                        password: "1234"
                    })
                    .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.NOTFOUND);
        expect(res.body.message).toBe("User not found");
    })

    it('POST: /login should return 400 & valid response for bad request', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/login/')
                    .send({ password: "1234" })
                    .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.BADREQUEST);
    })


    // -------------------------------------------------------------------------
    // Logout User
    // -------------------------------------------------------------------------

    it('POST: /logout should return 200 & valid response user logout', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/logout/')
                    .set('Cookie', [`refreshToken=${refreshTokenToBeRevoked}`])
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("logged out");
    })

    it('POST: /logout should return 401 & valid response user logout', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/logout/')
                    .set('Cookie', [`refreshToken=${randomAuthorization}`])
                    .expect(401)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED);
        expect(res.body.message).toBe('Token Malfunctioned')
    })

    it('POST: /logout should return 400 & valid response no refresh token for logout route', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/logout/')
                    .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.BADREQUEST);
        expect(res.body.message).toBe('No Refresh Token')
    })

    it('POST: /logout should return 404 & valid response for already logged out user', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/logout/')
                    .set('Cookie', [`refreshToken=${refreshTokenToBeRevoked}`])
                    .expect(404);

        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.NOTFOUND);
        expect(res.body.message).toBe('RefreshToken not found')
    })




    // -------------------------------------------------------------------------
    // Refresh Token
    // -------------------------------------------------------------------------

    it('POST: /refresh-token should return 200 & valid response refresh token', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/refresh-token')
                    .set('Cookie', [`refreshToken=${refreshToken}`])
                    .send({refreshToken})
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Refreshed Access Token");
        expect(res.body.data.tokens.tokenType).toBe("Bearer");
        expect(res.body.data.tokens.accessToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.refreshToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
        expect(res.body.data.tokens.expiresAt).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
        refreshToken = res.body.data.tokens.refreshToken;
    })


    it('POST: /refresh-token should return 400 & valid response for omiting refreshtoken', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/refresh-token')
                    .send({})
                    .expect(400)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.BADREQUEST);
    })

    it('POST: /refresh-token should return 401 & valid response for random refresh token', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/refresh-token')
                    .send({refreshToken: randomAuthorization})
                    .expect(401)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED);
    })

    it('POST: /refresh-token should return 401 & valid response for revoked refresh token', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/refresh-token')
                    .send({refreshToken : refreshTokenToBeRevoked})
                    .expect(401)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.UNAUTHORIZED);
        expect(res.body.message).toBe('Please log in');
    })


    // -------------------------------------------------------------------------
    // Forgot Password
    // -------------------------------------------------------------------------

    it('POST: /forgot-password should return 200 & valid response for forgot password route', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/forgot-password')
                    .send({email: dummy.email})
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Email Sent to user');
    })


    it('POST: /forgot-password should return 404 & valid response for unregistered user', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/forgot-password')
                    .send({email: newDummy.email})
                    .expect(404)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.NOTFOUND)
        expect(res.body.message).toBe('User not found');
    })


    // -------------------------------------------------------------------------
    // Reset Password
    // -------------------------------------------------------------------------

    it('POST: /reset-password should return 200 & valid response for reset password route', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({password: "123", token: forgotPasswordToken})
                    .expect(200)
        
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Password changed');
        expect(res.body.data.user.id).toBe(dummyTwo.id);
        expect(res.body.data.user.username).toBe(dummyTwo.username);
        expect(res.body.data.user.email).toBe(dummyTwo.email);
        expect(res.body.data.user.profile.firstname).toBe(dummyTwo.profile.firstname);
        expect(res.body.data.user.profile.lastname).toBe(dummyTwo.profile.lastname);
    })

    it('POST: /reset-password should return 409 & valid response for same password', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({password: "123", token: forgotPasswordToken})
                    .expect(409)
        
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Same password');
        expect(res.body.error).toBe(ErrorType.CONFLICT)
    })


    it('POST: /reset-password should return 404 & valid response for unregistered user', async() => {
        const res = await request(app)
                    .post('/api/v1/auth/reset-password')
                    .send({password: "123", token: randomAuthorization})
                    .expect(404)
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe(ErrorType.NOTFOUND)
        expect(res.body.message).toBe('User not found');
    })


})