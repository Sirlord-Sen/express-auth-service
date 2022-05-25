import express from 'express'
import { Application } from 'express'
import { resolve } from 'path'
import * as bodyParser from 'body-parser'
import passport from "@providers/passport/passport"
import cors from 'cors'
import useragent from 'express-useragent'
import Container from 'typedi'
import { useContainer, useExpressServer } from 'routing-controllers'

export default class ExpressServer {
    public app: Application;
  
    constructor(){
        this.app = express();
        this.middlerwares();
        this.setupControllers();
    }

    middlerwares(){
        this.app.use(cors());
        this.app.use(useragent.express())
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(passport.initialize())
    }
  
    async setupControllers() {
        useContainer(Container);
        const Controllers = resolve(__dirname, "modules/**/*.controller.ts");
        const Middlewares = resolve(__dirname, "middlewares/*.middleware.ts");
        useExpressServer(this.app, { 
            controllers: [ Controllers ], 
            middlewares: [ Middlewares ],
            classTransformer: true, 
            defaultErrorHandler: false,
            validation: {
                whitelist: true, 
                forbidNonWhitelisted: true,
                forbidUnknownValues: true
            }
        });
    }
}





