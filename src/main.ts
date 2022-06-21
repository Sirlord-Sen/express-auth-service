'use strict'
import 'reflect-metadata';
import { bootstrapMicroframework } from "microframework-w3tec";

import { banner } from '@lib/banner';
import { Logger } from '@lib/logger';
import { expressLoader } from "@loaders/express.loader";
import { redisLoader } from "@loaders/redis.loader";
import { typeormLoader } from "@loaders/typeorm.loader";
import { iocLoader } from '@loaders/ioc.loader';
import { swaggerLoader } from '@loaders/swagger.loader';
import { winstonLoader } from '@loaders/winston.loader';
import { processLoader } from '@loaders/process.loader';

const log = new Logger(__filename);

bootstrapMicroframework({
    loaders: [
        winstonLoader,
        processLoader,
        iocLoader,
        typeormLoader,
        expressLoader,
        swaggerLoader,
        redisLoader,
    ]
})
    .then(() => banner(log))
    .catch(error => log.error('Application is crashed: ' + error));