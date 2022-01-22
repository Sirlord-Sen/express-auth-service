import 'reflect-metadata';
import { Connection } from  './common/config/typeorm.config'
import { Application } from './app';

async function bootstrap() {
    await Connection()
    new Application
}

bootstrap()