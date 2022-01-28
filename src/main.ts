'use strict'
import 'reflect-metadata';
import { Connection } from  './config/typeorm.config'
import { Application } from './app';

async function bootstrap() {
    await Connection()
    new Application()
}

bootstrap()