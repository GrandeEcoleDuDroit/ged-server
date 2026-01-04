import './instrument.js'
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import routes from '@routes/index';
import {setupExpressErrorHandler} from '@sentry/node';
import { d } from '@utils/logs';
import OracleApi from '@api/oracleApi';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORT, NODE_ENV, SSL_KEY_PATH, SSL_CERT_PATH } from './env'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.join(__dirname, '../');
const oracleApi = OracleApi.instance;
const app = express();
const productionEnvironment = NODE_ENV == 'production';

app.use(express.static(path.join(ROOT, 'public')));
app.get('/', (_: Request, res: Response) => {
    res.sendFile(path.join(ROOT, 'public/index.html'));
});
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

if (productionEnvironment) {
    setupExpressErrorHandler(app);
    const sslOptions = {
        key: fs.readFileSync(SSL_KEY_PATH as string),
        cert: fs.readFileSync(SSL_CERT_PATH as string)
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
    await oracleApi.closePool();
    process.exit(0);
});