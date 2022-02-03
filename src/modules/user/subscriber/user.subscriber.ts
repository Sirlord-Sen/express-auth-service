import argon2 from 'argon2'
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import UserEntity  from '../entity/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {

    beforeInsert(event: InsertEvent<UserEntity>): Promise<void> {
        return this.hashPassword(event.entity);
    }

  //FIXME:
    async beforeUpdate({entity, databaseEntity}: UpdateEvent<UserEntity>): Promise<void> {
        if (entity?.password) {
            await this.hashPassword(entity as UserEntity);
            entity.confirmTokenPassword = '';      
        }
    }

    async hashPassword(entity: UserEntity): Promise<void> {
        if (entity.password) entity.password = await argon2.hash(entity.password)
    }

    listenTo() {
        return UserEntity;
    }
}