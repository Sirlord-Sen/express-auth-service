import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { InternalError, NotFoundError } from '@utils/error-response.util';
import { FullRefreshToken } from '../auth.types';
import RefreshTokenEntity  from '../entity/refresh-token.entity';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { Logger } from '@utils/logger.util';

@EntityRepository(RefreshTokenEntity)
export default class RefreshTokenRepository extends Repository<RefreshTokenEntity> {

    async createRefreshToken(body: IRefreshToken): Promise<RefreshTokenEntity> {
        try{
            const token = this.create(body);
            return await this.save(token);
        }
        catch(err){ throw new InternalError('Could not save refresh token').send() }
  }

    async findOneToken( query: Partial<IRefreshToken> ): Promise<IRefreshToken> {
        try{ return await this.findOneOrFail({ where: query }); }
        catch(err){ throw new NotFoundError("Refresh Token not found").send() }
    }

    async updateRefreshToken( query: Partial<FullRefreshToken>, body: Partial<IRefreshToken> ): Promise<void> {
        try{ 
            const refreshToken = await this.findOneOrFail({where: query})
            if (refreshToken.isRevoked) Logger.warn("POTENTIAL THREAT: User in posession of Revoked RefreshToken")
            this.merge(refreshToken, body)
            await this.save(refreshToken) 
        }
        catch(err){ throw new InternalError('Could not update refresh token').send() }
    }
}