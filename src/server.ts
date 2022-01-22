import * as express from 'express'
import { Application } from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import { useExpressServer } from 'routing-controllers'
import morganMiddleware  from './common/middlewares/morgan.middlewae';


export class ExpressConfig {
    public app: Application;
  
    constructor(){
        this.app = express();
        this.middlerwares();
        this.setupControllers();
    }

    middlerwares(){
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(morganMiddleware)
    }
  
    async setupControllers() {
        const authControllers = path.resolve(__dirname, "auth/controller/**/*.ts");
        const userControllers = path.resolve(__dirname, "user/controller/**/*.ts");
        useExpressServer(this.app, { controllers: [ authControllers, userControllers ]});
    }
  
  }




