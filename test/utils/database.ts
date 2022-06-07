import { Connection, createConnection, useContainer } from 'typeorm';
import { DBConfig } from '../../src/config'
import { Container } from 'typeorm-typedi-extensions'
import { resolve } from 'path';

const { type ,username, password, database, synchronize, host, port } = DBConfig

export const createDatabaseConnection = async (): Promise<Connection> => {
    useContainer(Container);
    const connection = await createConnection({
        type,
        database,
        password,
        username,
        host,
        port,
        synchronize,
        entities: [resolve(__dirname, "../../src/api/modules/**/*.entity.ts")],
        subscribers: [resolve(__dirname, "../../src/api/modules/**/*.subscriber.ts")],
    });
    return connection;
};

export const synchronizeDatabase = async (connection: Connection) => {
    await connection.dropDatabase();
    return connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
    await connection.dropDatabase();
    return connection.runMigrations();
};

export const closeDatabase = (connection: Connection) => {
    return connection.close();
}