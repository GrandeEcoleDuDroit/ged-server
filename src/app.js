import 'module-alias/register.js';
import dotenv from 'dotenv';
dotenv.config();
import './instrument.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import * as Sentry from '@sentry/node';
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import applyMiddlewares from '#middlewares/index.js';
import routes from '#routes/index.js';
import { d } from '#utils/logs.js';
import oracleDatabaseConnection from '#config/oracleDatabaseConnection.js';
import { fileURLToPath } from 'url';

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