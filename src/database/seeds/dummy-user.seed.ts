import * as uuid from 'uuid';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { ProfileEntity, UserEntity } from '@user-module/entity';

export class CreateBruce implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();

        const user = new UserEntity();
        const profile = new ProfileEntity()
        profile.firstname = 'Bruce',
        profile.lastname = 'Wayne',
        user.id = uuid.v1();
        user.email = 'bruce.wayne@wayne-enterprises.com';
        user.username = 'bruce';
        user.password = '1234';
        user.profile = profile
        return await em.save(user);
    }

}