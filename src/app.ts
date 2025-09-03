import dotenv from 'dotenv';
import '@root/src/instrument.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import * as Sentry from '@sentry/node';
import path from "path";
import routes from '@routes/index';
import { d } from '@utils/logs';
import { oracleDatabaseConnection } from '@config/index';
dotenv.config();

const app = express();
const environment = process.env.NODE_ENV as string;
const port = process.env.PORT || 3000;
const sslKeyPath = process.env.SSL_KEY_PATH as string;
const sslCertPath = process.env.SSL_CERT_PATH as string;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(routes);

if (environment == 'production') {
  Sentry.setupExpressErrorHandler(app);
  const sslOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };

  https.createServer(sslOptions, app).listen(port, () => {
    d(`✅ HTTPS server started on port ${port}`);
  });
} else {
  app.listen(port, () => {
    d(`✅ HTTP server started on port ${port}`);
  });
}

process.on('SIGINT', async () => {
  await oracleDatabaseConnection.closePool();
  process.exit(0);
});