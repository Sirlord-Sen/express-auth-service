'use strict'
import 'reflect-metadata';
import { bootstrapMicroframework } from "microframework-w3tec";

import { Logger } from "@utils/logger.util";
import { expressLoader } from "@loaders/express.loader";
import { redisLoader } from "@loaders/redis.loader";
import { typeormLoader } from "@loaders/typeorm.loader";
import { iocLoader } from '@loaders/ioc.loader';

bootstrapMicroframework({

    loaders: [
        iocLoader,
        typeormLoader,
        expressLoader,
        redisLoader,
    ],
})
    .then(() => {})
    .catch(error => Logger.error('Application is crashed: ' + error));