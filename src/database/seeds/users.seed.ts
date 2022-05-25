import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { ProfileEntity } from '@user-module/entity';

export class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        await factory(ProfileEntity)().createMany(14)
    }
}