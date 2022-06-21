import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { RefreshTokenEntity } from '@auth-module/entity';
import { DateHelper } from '@helpers/';
import { JwtConfig } from '@config/';
import { nanoid } from 'nanoid';

export class CreateDummyRefreshToken implements Seeder {
    public static userId: string;

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const ms = DateHelper.convertToMS(JwtConfig.refreshTokenExpiration);
        const expiresAt = DateHelper.addMillisecondToDate(new Date(), ms);

        const refreshToken = new RefreshTokenEntity();
        refreshToken.browser = "unknown";
        refreshToken.os = "unknown";
        refreshToken.userId = CreateDummyRefreshToken.userId
        refreshToken.jti = nanoid()
        refreshToken.expiresAt = expiresAt;
        return await em.save(refreshToken);
    }

}