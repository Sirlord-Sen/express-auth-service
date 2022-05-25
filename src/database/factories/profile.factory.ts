import * as uuid from 'uuid';
import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';

import { ProfileEntity, UserEntity } from '@user-module/entity';

define(ProfileEntity, (faker: typeof Faker) => {
    // const gender = faker.datatype.number(1);
    const firstname = faker.name.firstName();
    const lastname = faker.name.lastName();
    const picture = faker.internet.avatar()

    const profile = new ProfileEntity();
    profile.id = uuid.v1();
    profile.firstname = firstname;
    profile.lastname = lastname;
    profile.picture = picture;
    profile.user = factory(UserEntity)() as any
    return profile;
});