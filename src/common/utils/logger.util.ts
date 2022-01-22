import * as winston from 'winston'
import * as config from 'config'
import {Application} from 'express'

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // winston.format.label({label: 'user-service'}),
    winston.format.colorize({all: true}),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message} \n`,
    )
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
]

export const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
})

process.on('unhandledRejection', (reason, p) => {
    Logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});