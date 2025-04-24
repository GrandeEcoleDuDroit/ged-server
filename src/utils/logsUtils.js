const winston = require('winston');
const { combine, timestamp, json, prettyPrint, errors } = winston.format;
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

const log = winston.createLogger({
   level: 'info',
   format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint()
   ),
   transports: [getTransport()]
});

function getTransport() {
     const token = process.env.BETTER_STACK_TOKEN;
     const endpoint = process.env.BETTER_STACK_ENDPOINT;

     if (token && endpoint) {
          const logtail = new Logtail(token, { endpoint: endpoint });
         return new LogtailTransport(logtail);
     } else {
           return new winston.transports.Console();
      }
}

module.exports = log;