import * as dotenv from 'dotenv'
import config from 'config';
import { ExpressConfig } from './server';
import { Logger }  from './common/utils/logger.util';

export class Application {
    private express: ExpressConfig;

    constructor()  {
        dotenv.config()
        this.express = new ExpressConfig();
        this.start()
    }

    private async start(){
        const port = config.get('server.port')
        this.express.app.listen(port, () => {
          Logger.info
          (`
            ------------
            Server Started!
            Http: http://localhost:${port}
            -------------
          `);
        });
    }

}