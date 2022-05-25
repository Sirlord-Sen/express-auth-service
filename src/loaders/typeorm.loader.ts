import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createConnection, getConnectionOptions } from 'typeorm';
import { DBConfig } from '@config//'
import { Logger } from '@utils/logger.util';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {

    const { type ,username, password, database, synchronize, host, port } = DBConfig
    const loadedConnectionOptions = await getConnectionOptions();

    const connectionOptions = Object.assign(loadedConnectionOptions, {
        type,
        host,
        port,
        username,
        password,
        database,
        synchronize,
        entities: ["src/modules/**/*.entity.ts"],
        subscribers: ["src/modules/**/*.subscriber.ts"],
        migrations: ["src/db/migrations/**/*.ts"],
        cli: {
            migrationsDir: './migration',
        }
    });

    const connection = await createConnection(connectionOptions);
    Logger.info("Database Connected")

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};