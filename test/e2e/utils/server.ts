import { useRefreshDatabase} from 'typeorm-seeding';

// import { migrateDatabase } from '../../utils/database';
import { bootstrapApp } from './bootstrap';

export const prepareServer = async (options?: { migrate: boolean }) => {
    const settings = await bootstrapApp();
    // if (options && options.migrate) {
    //     await migrateDatabase(settings.connection);
    // }
    // useRefreshDatabase({connection: 'memory'});
    return settings;
};