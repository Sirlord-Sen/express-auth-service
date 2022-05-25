import { ProfileEntity, UserEntity } from '@user/entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        await factory(ProfileEntity)().createMany(14)
    }
}