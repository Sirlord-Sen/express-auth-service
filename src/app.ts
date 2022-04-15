import ExpressServer  from './server';
import { Logger }  from '@utils/logger.util';
import { parsedEnv } from '@config//';

export class Application {
    private express: ExpressServer;

    constructor()  {
        this.express = new ExpressServer()
        this.start()
    }

    private async start(){
        const port = parsedEnv.PORT
        this.express.app.listen(port, () => {
          Logger.info(`Server Started! Http: http://localhost:${port}`);
        });
    }

}