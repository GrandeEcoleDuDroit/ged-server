import winston from 'winston';
import { captureException } from '@sentry/node';

const productionEnvironment = process.env.NODE_ENV == 'production';
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

const log = winston.createLogger({
   level: 'debug',
   format: combine(
       errors({ stack: true }),
       colorize({ all: true }),
       timestamp({
           format: 'YYYY-MM-DD HH:mm:ss'
       }),
       align(),
       printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
   ),
   transports: [
       new winston.transports.Console()
   ]
});

export const d = function (message: string) {
    log.debug(message)
}

export const i = function(message: string) {
    log.info(message)
}

export const w = function (message: string) {
    log.warn(message)
}

export const e = function (message: string, error: any) {
    log.error(message, error);
    if (productionEnvironment) {
        captureException(e)
    }
}