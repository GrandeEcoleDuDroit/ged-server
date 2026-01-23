import {readFileSync} from 'fs';
import {join} from 'path';
import {ROOT_PATH} from '@root/env';

const dbConfigPath = join(ROOT_PATH!, 'dbConfig.json');

export const dbConfig = JSON.parse(readFileSync(dbConfigPath, 'utf-8'));