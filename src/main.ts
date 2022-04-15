'use strict'
import 'reflect-metadata';
import { DB } from  '@db//'
import { Application } from './app';
import { useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions'

async function bootstrap() {
    useContainer(Container);
    await DB.on()
    new Application()
}
bootstrap()