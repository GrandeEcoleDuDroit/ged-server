import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const ROOT_PATH = process.env.ROOT_PATH;
export const ORACLE_HOME = process.env.ORACLE_HOME;
export const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
export const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
export const NODE_ENV = process.env.NODE_ENV

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

export const OBJECT_STORAGE_NAMESPACE = process.env.OBJECT_STORAGE_NAMESPACE;
export const OBJECT_STORAGE_BUCKET_NAME = process.env.OBJECT_STORAGE_BUCKET_NAME;