import * as uuid from 'uuid';
import * as nock from 'nock';
import { JWTService } from '@providers/jwt';
import { nanoid } from 'nanoid';
import { JwtConfig } from '@config//';
import { SignOptions } from 'jsonwebtoken';

type JWT = {
    email?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    userId?: string;
};

describe('JWTService', () => {
    let token:string;
    let payload: Partial<JWT>
    let tokenData: {payload: JWT, secret: string, opts?: SignOptions};
    let jwtService: JWTService;

    beforeAll(async () => {
        jwtService = new JWTService()
        payload = {
            jti: nanoid(),
            userId: uuid.v4(),
            email: 'dummy@gmail.com',
        };
        tokenData = {
            payload, 
            secret: JwtConfig.refreshTokenSecret, 
            opts:{
                expiresIn: JwtConfig.accessTokenExpiration,
            }
        }
    });

    afterAll(async () => {
        nock.cleanAll();
    })

    it('Should return jwt token from synchronous sign', () => {
        token = jwtService.sign<JWT>(tokenData.payload, tokenData.secret, tokenData.opts);

        expect(typeof token).toBe('string');
    });

    it('Should return jwt token from asynchronous sign', async () => {
        token = await jwtService.signAsync<JWT>(tokenData.payload, tokenData.secret, tokenData.opts);

        expect(typeof token).toBe('string');
    });



    it('Should return jwt decoded data from synchronous verify', () => {
        const data = jwtService.verify<JWT>(
            token,
            JwtConfig.refreshTokenSecret,
        );

        expect(data).toHaveProperty('iat');
        expect(data).toHaveProperty('exp');
        expect(data.email).toBe(payload.email);
        expect(data.jti).toBe(payload.jti);
        expect(data.userId).toBe(payload.userId);
    });

    it('Should return jwt decoded data from asynchronous verify', async () => {
        const data = await jwtService.verifyAsync<JWT>(
            token,
            JwtConfig.refreshTokenSecret,
        );

        expect(data).toHaveProperty('iat');
        expect(data).toHaveProperty('exp');
        expect(data.email).toBe(payload.email);
        expect(data.jti).toBe(payload.jti);
        expect(data.userId).toBe(payload.userId);
    });

    it('Should return decoding error data from asynchronous verify with wrong secret', async () => {
        try { await jwtService.verifyAsync<JWT>( token, uuid.v4() ); }
        catch(e:any){
            expect(e.success).toBe(false);
            expect(e.status_code).toBe(401);
            expect(e.error).toBe("AuthFailureError");
            expect(e.message).toBe('Token Malfunctioned')

        }
    });

});