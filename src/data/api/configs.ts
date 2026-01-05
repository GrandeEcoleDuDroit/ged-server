import {readFileSync} from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '../../../');
const dbConfigPath = join(ROOT, 'dbConfig.json');
const firebaseCredentialsPath = join(ROOT, 'firebase_credentials.json');

export const dbConfig = JSON.parse(readFileSync(dbConfigPath, 'utf-8'));
export const firebaseCredentials = JSON.parse(readFileSync(firebaseCredentialsPath, 'utf-8'));