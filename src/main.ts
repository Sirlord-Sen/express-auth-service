'use strict'
import 'reflect-metadata';
import { Logger } from "@utils/logger.util";
import { bootstrapMicroframework } from "microframework-w3tec";
import { expressLoader } from "./loaders/express.loader";
import { redisLoader } from "./loaders/redis.loader";
import { typeormLoader } from "./loaders/typeorm.loader";
import { iocLoader } from './loaders/ioc.loader';

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders: [
        iocLoader,
        typeormLoader,
        expressLoader,
        redisLoader,
    ],
})
    .then(() => {})
    .catch(error => Logger.error('Application is crashed: ' + error));