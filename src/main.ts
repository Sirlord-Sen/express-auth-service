'use strict'
import 'reflect-metadata';
import { DB } from  '@db//'
import { Application } from './app';

async function bootstrap() {
    await DB.on()
    new Application()
}

bootstrap()