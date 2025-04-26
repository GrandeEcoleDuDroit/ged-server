const winston = require('winston');
const Sentry = require("@sentry/node");
const prodEnvironment = process.env.NODE_ENV == 'production';

const { combine, timestamp, json, prettyPrint, errors } = winston.format;

const log = winston.createLogger({
   level: 'info',
   format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint()
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