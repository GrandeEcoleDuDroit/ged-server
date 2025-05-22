const winston = require('winston');
const Sentry = require("@sentry/node");
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

const d = function (message) {
    log.debug(message)
}

const i = function(message) {
    log.info(message)
}

const w = function (message) {
    log.warn(message)
}

const e = function (message, error) {
    log.error(message, error);
    if (prodEnvironment) {
        Sentry.captureException(e)
    }
}

module.exports = { d, i, w, e };