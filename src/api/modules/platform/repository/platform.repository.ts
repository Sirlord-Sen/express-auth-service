import { EntityRepository, Repository } from 'typeorm'

import { PlatformEntity } from '../entity';
import { Platform } from '../platform.types';
import { InternalServerError, ConflictError } from '@exceptions//';

@EntityRepository(PlatformEntity)
export class PlatformRepository extends Repository<PlatformEntity>{
    async createPlatform(body: Platform): Promise<PlatformEntity> {
        try {
            const platform = this.create(body);
            await this.save(platform);
            return platform;
        } 
        catch (err:any) { 
            if (err.code === '23505' || 'ER_DUP_ENTRY') throw new ConflictError('User already exist')
            throw new InternalServerError('User could not be saved')
        }
    }

}
