import express from 'express'
import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import passport from "@providers/social/passport"
import cors from 'cors'
import useragent from 'express-useragent'
import { resolve } from 'path'
import * as bodyParser from 'body-parser'
import { useExpressServer } from 'routing-controllers'
import { AppConfig } from '@config//'
import { Logger } from '@utils/logger.util'
import { authorizationChecker } from '../auth/authorizationChecker'
import { Connection } from 'typeorm';
import { currentUserChecker } from 'src/auth/currentUserChecker';

class ExpressServer {
    public app: Application;
  
    constructor(connection: Connection){
        this.app = express();
        this.middlerwares();
        this.setupControllers(connection)
    }

    middlerwares(){
        this.app.use(cors());
        this.app.use(useragent.express())
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(passport.initialize())
    }
  
    public setupControllers(connection: Connection) {
        const Controllers = resolve(__dirname, "../modules/**/*.controller.ts");
        const Middlewares = resolve(__dirname, "../middlewares/*.middleware.ts");
        useExpressServer<Application>(this.app, { 
            controllers: [ Controllers ], 
            middlewares: [ Middlewares ],
            classTransformer: true, 
            defaultErrorHandler: false,
            validation: {
                whitelist: true, 
                forbidNonWhitelisted: true,
                forbidUnknownValues: true
            },
            authorizationChecker: authorizationChecker(connection),
            currentUserChecker: currentUserChecker(connection)
        });
    }

    async start(){
        this.app.listen(AppConfig.port, () => {
          Logger.info(`Server Started! Http: http://localhost:${AppConfig.port}`);
        });
    }
}


export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        const connection = settings.getData('connection');

        const expressApp: ExpressServer = new ExpressServer(connection)

        // Run application to listen on given port
        if (AppConfig.env !== 'test') {
            const server = expressApp.start()
            settings.setData('express_server', server);
        }

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp);
    }
};