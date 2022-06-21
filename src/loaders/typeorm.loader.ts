import { resolve } from 'path'
import { createConnection, getConnectionOptions } from 'typeorm';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { DBConfig } from '@config/'

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
        entities: [resolve(__dirname, "../api/modules/**/*.entity.ts")],
        subscribers: [resolve(__dirname, "../api/modules/**/*.subscriber.ts")],
        migrations: [resolve(__dirname, "../database/migrations/**/*.ts")],
        cli: {
            migrationsDir: resolve(__dirname, "../database/migrations/"),
        }
    });

    const connection = await createConnection(connectionOptions);

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};