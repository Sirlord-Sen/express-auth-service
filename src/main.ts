'use strict'
import 'reflect-metadata';
import { DB } from  '@db//'
import { Application } from './app';
import TokensCache from '@utils/cache.util';

async function bootstrap() {
    // new TokensCache()
    await DB.on()
    new Application()
}
bootstrap()