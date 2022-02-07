import express from 'express'
import { Application } from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import cors from 'cors'
import useragent from 'express-useragent'
import { useExpressServer } from 'routing-controllers'
import morganMiddleware  from '@middlewares/morgan.middleware';
import { CustomErrorHandler } from '@middlewares/error.middleware'

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
        this.app.use(morganMiddleware)
    }
  
    async setupControllers() {
        const Controllers = path.resolve(__dirname, "modules/**/*.controller.ts");
        useExpressServer(this.app, { 
            controllers: [ Controllers ], 
            middlewares: [ CustomErrorHandler ],
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





