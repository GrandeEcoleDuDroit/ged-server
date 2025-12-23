import fs from 'fs';
import path from 'path';
import os from 'os';
import FirebaseApi from '@api/firebaseApi';
import FcmToken from '@models/fcmToken';
import type { FcmMessage } from '@models/fcmMessage';

const firebaseApi = new FirebaseApi();
const userDir = path.join(os.homedir(), 'gedoise-data', 'users');

export default class FcmRepository {
    async upsertToken(fcmToken: FcmToken)  {
        await firebaseApi.getFirestore()
            .collection('credentials')
            .doc(fcmToken.userId)
            .set(fcmToken.toJson(), { merge: true });

        const dirPath = path.join(userDir, `${fcmToken.userId}`);
        const filePath = path.join(dirPath, FcmToken.fileName());

        await fs.promises.mkdir(dirPath, { recursive: true });

        await fs.promises.writeFile(filePath, fcmToken.value, 'utf8');
    }

    async getTokenValue(userId: string) {
        const filePath = path.join(userDir, `${userId}`, FcmToken.fileName());
        return fs.promises.readFile(filePath, 'utf8');
    }

    async sendNotification(fcmMessage: FcmMessage) {
        await firebaseApi.sendNotification(fcmMessage);
    }
}