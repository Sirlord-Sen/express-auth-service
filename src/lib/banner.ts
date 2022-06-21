import { AppConfig, SwaggerConfig } from '@config/';
import { Logger } from './logger';

export function banner(log: Logger): void {
    if (AppConfig.banner) {
        const route = () => `${AppConfig.schema}://${AppConfig.host}:${AppConfig.port}`;
        log.info(`Aloha, your app is ready on ${route()}${AppConfig.routePrefix}`);
        log.info(`To shut it down, press <CTRL> + C at any time.`);
        log.info('-------------------------------------------------------');
        log.info(`Environment  : ${AppConfig.env}`);
        log.info(`Version      : ${AppConfig.version}`);
        log.info(`API Info     : ${route()}${AppConfig.routePrefix}`);
        if (SwaggerConfig.enabled) log.info(`Swagger      : ${route()}${SwaggerConfig.route}`);
        log.info('-------------------------------------------------------');
    } else {
        log.info(`Application is up and running.`);
    }
}