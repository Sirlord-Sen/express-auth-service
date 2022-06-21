import { Service } from 'typedi'
import { EntityRepository } from 'typeorm';

import { RefreshTokenEntity }  from '../entity';
import { RepositoryCore } from '@core/';

@Service()
@EntityRepository(RefreshTokenEntity)
export class RefreshTokenRepository extends RepositoryCore<RefreshTokenEntity> {}