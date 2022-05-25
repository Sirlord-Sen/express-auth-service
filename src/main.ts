'use strict'
import 'reflect-metadata';
import { Database } from  '@db//'
import { Application } from './app';
import { useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions'

async function bootstrap() {
    useContainer(Container);
    await Database.createConnection()
    new Application()
}
bootstrap()