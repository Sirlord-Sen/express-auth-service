import * as uuid from 'uuid';
import faker from 'faker';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { ProfileEntity, UserEntity } from '@user-module/entity';

export class CreateDummyUser implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const gender = faker.datatype.number(1);
        const firstName = faker.name.firstName(gender);
        const lastName = faker.name.lastName(gender);
        const email = faker.internet.email(firstName, lastName);
        const username = faker.internet.userName(firstName, lastName);


        const user = new UserEntity();
        const profile = new ProfileEntity()
        profile.firstname = firstName,
        profile.lastname = lastName,
        user.id = uuid.v4();
        user.email = email;
        user.username = username;
        user.password = '1234';
        user.profile = profile
        return await em.save(user);
    }

}