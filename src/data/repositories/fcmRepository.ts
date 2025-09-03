import fs from 'fs';
import os from 'os';
import path from 'path';
import { FirebaseApi } from '@data/api/firebaseApi';
import { FcmToken } from '@models/fcmToken';
import type { FcmMessage } from "@models/fcmMessage.ts";
import type { Message } from "firebase-admin/messaging";

const firestoreAPI = new FirebaseApi();
const homeDir = os.homedir();
const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users');

export class FcmRepository {
    async upsertToken(fcmToken: FcmToken) {
        await firestoreAPI.upsertToken(fcmToken);
        const dirPath = path.join(userDir, `${fcmToken.userId}`);
        const filePath = path.join(`${dirPath}`, FcmToken.fileName());
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(filePath, fcmToken.value, 'utf8');
    }

    async getTokenValue(userId: string) {
        const filePath = path.join(userDir, `${userId}`, FcmToken.fileName());
        return fs.readFileSync(filePath, 'utf8');
    }

    async sendNotification(fcmMessage: FcmMessage, token: string) {
        const message: Message = {
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.android.priority
            },
            token: token
        }
        await firestoreAPI.sendNotification(message);
    }
}