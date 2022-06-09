import { Service } from 'typedi'
import { EntityNotFoundError, EntityRepository, Repository } from 'typeorm';

import { RefreshTokenEntity }  from '../entity';
import { FullRefreshToken } from '../auth.types';
import { InternalServerError, NotFoundError, UnauthorizedError } from '@exceptions//';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

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
            this.merge(refreshToken, body)
            await this.save(refreshToken) 
        }
        catch(err){ 
            if(err instanceof EntityNotFoundError) throw new NotFoundError('Refresh Token not found')
            throw new InternalServerError('Could not update refresh token') 
        }
    }
}