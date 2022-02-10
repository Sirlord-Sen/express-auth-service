import { Logger } from '@utils/logger.util'
import {
    EntitySubscriberInterface,
    EventSubscriber,
    UpdateEvent
} from 'typeorm'
import RefreshTokenEntity from '../entity/refreshToken.entity'

@EventSubscriber()
export class RefreshTokenSubscriber implements EntitySubscriberInterface<RefreshTokenEntity>{

    async beforeUpdate({entity, databaseEntity}: UpdateEvent<RefreshTokenEntity>): Promise<void>{
        // console.log(entity)
        // console.log(databaseEntity)
        // // if (entity?.isRevoked && databaseEntity.isRevoked){
        // //     if(databaseEntity.isRevoked === true){
        // //         Logger.warn('User has accessToken after Logout!!')
        // //     }
        // // }
    }

    listenTo(){
        return RefreshTokenEntity
    }
}
