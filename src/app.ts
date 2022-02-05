import { ExpressConfig } from './server';
import { Logger }  from '@utils/logger.util';
import { parsedEnv } from '@config//';

export class Application {
    private express: ExpressConfig;

    constructor()  {
        this.express = new ExpressConfig();
        this.start()
    }

    private async start(){
        const port = parsedEnv.PORT
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