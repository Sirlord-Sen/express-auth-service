import { EntityRepository, Repository } from 'typeorm';
import { FullRefreshToken } from '../auth.types';
import { RefreshTokenEntity }  from '../entity';
import { IRefreshToken } from '../interfaces/refresh-token.interface';
import { Logger } from '@utils/logger.util';
import { Service } from 'typedi'
import { InternalServerError, NotFoundError } from '@exceptions//';

@Service()
@EntityRepository(RefreshTokenEntity)
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {

    async createRefreshToken(body: IRefreshToken): Promise<RefreshTokenEntity> {
        try{
            const token = this.create(body);
            return await this.save(token);
        }
        catch(err){ throw new InternalServerError('Could not save refresh token') }
  }

    async findOneToken( query: Partial<IRefreshToken> ): Promise<IRefreshToken> {
        try{ return await this.findOneOrFail({ where: query }); }
        catch(err){ throw new NotFoundError("Refresh Token not found") }
    }

    async updateRefreshToken( query: Partial<FullRefreshToken>, body: Partial<IRefreshToken> ): Promise<void> {
        try{ 
            const refreshToken = await this.findOneOrFail({where: query})
            if (refreshToken.isRevoked) Logger.warn("POTENTIAL THREAT: User in posession of Revoked RefreshToken")
            this.merge(refreshToken, body)
            await this.save(refreshToken) 
        }
        catch(err){ throw new InternalServerError('Could not update refresh token') }
    }
}