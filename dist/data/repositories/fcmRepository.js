import fs from 'fs';
import os from 'os';
import path from 'path';
import { FirebaseApi } from '../api/firebaseApi.ts';
import { FcmToken } from '../models/fcmToken.ts';
const firestoreAPI = new FirebaseApi();
const homeDir = os.homedir();
const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users');
export class FcmRepository {
    async upsertToken(fcmToken) {
        await firestoreAPI.upsertToken(fcmToken);
        const dirPath = path.join(userDir, `${fcmToken.userId}`);
        const filePath = path.join(`${dirPath}`, FcmToken.fileName());
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(filePath, fcmToken.value, 'utf8');
    }
    async getTokenValue(userId) {
        const filePath = path.join(userDir, `${userId}`, FcmToken.fileName());
        return fs.readFileSync(filePath, 'utf8');
    }
    async sendNotification(fcmMessage, token) {
        const message = {
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.android.priority
            },
            token: token
        };
        await firestoreAPI.sendNotification(message);
    }
}
