import {readFileSync} from 'fs';
import {join} from 'path';
import {ROOT_PATH} from '@root/env';

const dbConfigPath = join(ROOT_PATH!, 'dbConfig.json');
const firebaseCredentialsPath = join(ROOT_PATH!, 'firebase_credentials.json');

export const dbConfig = JSON.parse(readFileSync(dbConfigPath, 'utf-8'));
export const firebaseCredentials = JSON.parse(readFileSync(firebaseCredentialsPath, 'utf-8'));