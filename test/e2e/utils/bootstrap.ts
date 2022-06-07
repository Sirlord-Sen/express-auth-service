import { Application } from 'express';
import * as http from 'http';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Connection } from 'typeorm/connection/Connection';

import { expressLoader } from '../../../src/loaders/express.loader';
import { redisLoader } from '../utils/redis.loader';
import { iocLoader } from '../../../src/loaders/ioc.loader';
import { typeormLoader } from '../utils/typeorm.loader';
import { Redis } from 'ioredis-mock';

export interface BootstrapSettings {
    app: Application;
    server: http.Server;
    connection: Connection;
    redis: Redis
}

export const bootstrapApp = async (): Promise<BootstrapSettings> => {
    const framework = await bootstrapMicroframework({
        loaders: [
            iocLoader,
            typeormLoader,
            expressLoader,
            redisLoader
        ],
    });
    return {
        app: framework.settings.getData('express_app') as Application,
        server: framework.settings.getData('express_server') as http.Server,
        connection: framework.settings.getData('connection') as Connection,
        redis: framework.settings.getData('redis') as Redis,
    } as BootstrapSettings;
};