import dotenv from 'dotenv';
import './instrument.js'
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import routes from '@routes/index';
import {setupExpressErrorHandler} from "@sentry/node";
import { d } from '@utils/logs';
import OracleApi from '@api/oracleApi';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const oracleApi = OracleApi.instance;

dotenv.config();
const app = express();

const productionEnvironment = process.env.NODE_ENV == 'production';
const PORT = process.env.PORT || 3000;
const sslKeyPath = process.env.SSL_KEY_PATH as string;
const sslCertPath = process.env.SSL_CERT_PATH as string;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

if (productionEnvironment) {
    setupExpressErrorHandler(app);
    const sslOptions = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath)
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