import { Logger, LoggerInterface } from '@decorators/logger'
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm'

import RefreshTokenEntity from '../entity/refresh-token.entity'

@EventSubscriber()
export class RefreshTokenSubscriber implements EntitySubscriberInterface<RefreshTokenEntity>{
    constructor(@Logger(__filename) private log: LoggerInterface){}
    async beforeUpdate({entity, databaseEntity}: UpdateEvent<RefreshTokenEntity>): Promise<void>{
        // console.log(entity)
        // console.log(databaseEntity)
        // // if (entity?.isRevoked && databaseEntity.isRevoked){
        // //     if(databaseEntity.isRevoked === true){
        // //         this.log.warn('User has accessToken after Logout!!')
        // //     }
        // // }
    }

    listenTo(){
        return RefreshTokenEntity
    }
}
