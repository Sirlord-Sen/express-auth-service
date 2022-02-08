'use strict'
import 'reflect-metadata';
import { DB } from  '@db//'
import { Application } from './app';
import AppCache from '@utils/cache.util';

async function bootstrap() {
    new AppCache()
    await DB.on()
    new Application()
}
bootstrap()