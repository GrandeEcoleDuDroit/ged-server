import winston from 'winston';
import * as Sentry from '@sentry/node';

const prodEnvironment = process.env.NODE_ENV === 'production';

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

export const d = function (message) {
    log.debug(message)
}

export const i = function(message) {
    log.info(message)
}

export const w = function (message) {
    log.warn(message)
}

export const e = function (message, error) {
    log.error(message, error);
    if (prodEnvironment) {
        Sentry.captureException(e)
    }
}

export default { d, i, w, e };