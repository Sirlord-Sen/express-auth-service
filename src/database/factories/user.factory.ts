import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';
import { UserEntity } from '@user/entity';

define(UserEntity, (faker: typeof Faker) => {
    const email = faker.internet.email();
    const username = faker.internet.userName();

    const user = new UserEntity();
    user.id = uuid.v1();
    user.email = email;
    user.username = username;
    user.password = '1234';
    return user;
});