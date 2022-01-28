import { EntityRepository, Repository } from 'typeorm';
import { InternalError } from '../../../utils/error-response.util';
import RefreshTokenEntity  from '../entity/refreshToken.entity';
import { IRefreshToken } from '../interfaces/token.interface';

@EntityRepository(RefreshTokenEntity)
export default class RefreshTokenRepository extends Repository<RefreshTokenEntity> {

    async createRefreshToken(body: IRefreshToken): Promise<RefreshTokenEntity> {
        try{
            const token = this.create(body);
            return await this.save(token);
        }
        catch(err){ 
            console.log(err)
            throw new InternalError('Could not save refresh token').send() }
  }

    // async findOneTokenOrFail( query: Partial<RefreshToken> ): Promise<RefreshToken> {
    //     return this.findOneOrFail({ where: query });
    // }

    // async updateRefreshToken( query: Partial<FullRefreshToken>, body: Partial<RefreshToken> ): Promise<void> {
    //     await this.update(query, body);
    // }
}