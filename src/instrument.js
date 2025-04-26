const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "https://f62e2d36da709dbe2fd0a3fb96767b96@o4509220037656576.ingest.de.sentry.io/4509220044800080",

    sendDefaultPii: true,
});