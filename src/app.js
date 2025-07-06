require('module-alias/register');
require('dotenv').config();
require('./instrument');

const express = require('express');
const applyMiddlewares = require('@middlewares');
const routes = require('@routes');

const fs = require('fs');
const https = require('https');
const Sentry = require('@sentry/node');
const { d } = require('@utils/logs');
const { oracleDatabaseConnection } = require('@config');
const path = require("path");
const app = express();

const prod = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

applyMiddlewares(app);

app.use(routes);

if (prod) {
  Sentry.setupExpressErrorHandler(app);
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    d(`✅ HTTPS server started on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    d(`✅ HTTP server started on port ${PORT}`);
  });
}

process.on('SIGINT', async () => {
  await oracleDatabaseConnection.closePool();
  process.exit(0);
});