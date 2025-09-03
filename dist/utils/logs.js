import winston from 'winston';
import * as Sentry from '@sentry/node';
const prodEnvironment = process.env['NODE_ENV'] === 'production';
const { combine, timestamp, printf, colorize, align, errors } = winston.format;
const log = winston.createLogger({
    level: 'debug',
    format: combine(errors({ stack: true }), colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [new winston.transports.Console()]
});
export const d = (message) => {
    log.debug(message);
};
export const i = (message) => {
    log.info(message);
};
export const w = (message) => {
    log.warn(message);
};
export const e = (message, error) => {
    log.error(message, error);
    if (prodEnvironment) {
        Sentry.captureException(e);
    }
};
