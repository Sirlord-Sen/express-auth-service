import { EntityRepository } from 'typeorm'

import { UserEntity } from '../entity'
import { RepositoryCore } from '@core//'

@EntityRepository(UserEntity)
export class UserRepository extends RepositoryCore<UserEntity>{}
