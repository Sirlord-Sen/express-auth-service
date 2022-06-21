import { EntityRepository } from 'typeorm'

import { PlatformEntity } from '../entity';
import { RepositoryCore } from '@core/';

@EntityRepository(PlatformEntity)
export class PlatformRepository extends RepositoryCore<PlatformEntity>{}
