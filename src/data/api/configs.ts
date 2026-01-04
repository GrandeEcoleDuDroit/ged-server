import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = path.join(__dirname, '../../../');
const dbConfigPath = path.join(ROOT, 'dbConfig.json');
const firebaseCredentialsPath = path.join(ROOT, 'firebase_credentials.json');

export const dbConfig = JSON.parse(fs.readFileSync(dbConfigPath, 'utf-8'));
export const firebaseCredentials = JSON.parse(fs.readFileSync(firebaseCredentialsPath, 'utf-8'));