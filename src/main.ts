'use strict'
import 'reflect-metadata';
import { Connection } from  './db/db.connection'
import { Application } from './app';

async function bootstrap() {
    await Connection()
    new Application()
}

bootstrap()