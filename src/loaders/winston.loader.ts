import { AppConfig } from '@config/';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { configure, format, transports } from 'winston';

export const winstonLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    }

    configure({
        level: AppConfig.env === 'development' ? 'debug' : 'warn',
        levels,
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            // format.label({label: 'user-service'}),
            format.colorize({all: true}),
            format.printf( (info) => `[${info.timestamp}] ${info.level}: ${info.message} \n`, )
        ), 
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/combined.log' }),
        ]
    });
};