import * as uuid from 'uuid';
import faker from 'faker';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { ProfileEntity, UserEntity } from '@user-module/entity';
import { nanoid } from 'nanoid';

export class CreateDummyUser implements Seeder {

    public userData(){
        const gender = faker.datatype.number(1);
        const firstname = faker.name.firstName(gender);
        const lastname = faker.name.lastName(gender);
        const email = faker.internet.email(firstname, lastname);
        const username = faker.internet.userName(firstname, lastname);
        return {gender, firstname, lastname, email, username }
    }

    public async run(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        
        const { gender, firstname, lastname, email, username } = this.userData()
        
        const user = new UserEntity();
        const profile = new ProfileEntity()
        profile.firstname = firstname,
        profile.lastname = lastname,
        user.email = email;
        user.username = username;
        user.password = '1234';
        user.profile = profile;
        user.accountActivationToken = nanoid()
        user.passwordResetToken = nanoid()
        return await em.save(user);
    }

}