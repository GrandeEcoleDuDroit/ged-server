import fs from 'fs';
import path from 'path';
import os from 'os';
import FirebaseApi from '@api/firebaseApi';
import type {FcmMessage, FcmMulticastMessage} from '@models/fcmMessage';
import type {FcmToken} from "@models/fcmToken";

const firebaseApi = new FirebaseApi();
const userDir = path.join(os.homedir(), 'gedoise-data', 'users');

export default class FcmRepository {
    async getFcmToken(userId: string) {
        const filePath = this.getFilePath(userId);
        return await fs.promises.readFile(filePath, 'utf8')
            .then(json => JSON.parse(json) as FcmToken)
            .catch(() => null);
    }

    async addToken(userId: string, token: string)  {
        let fcmToken = await this.getFcmToken(userId) ?? { tokens: [] };
        if (!fcmToken?.tokens.includes(token)) {
            fcmToken?.tokens.push(token);
        }

        const dirPath = this.getDirPath(userId);
        const filePath = this.getFilePath(userId);
        const json = JSON.stringify(fcmToken);

        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(filePath, json, 'utf8');
    }

    async deleteToken(userId: string, token: string) {
        let fcmToken = await this.getFcmToken(userId);
        if (!fcmToken) { return; }
        fcmToken.tokens = fcmToken.tokens.filter(value => value !== token);

        const filePath = this.getFilePath(userId);
        const json = JSON.stringify(fcmToken);
        await fs.promises.writeFile(filePath, json, 'utf8');
    }

    async sendNotification(fcmMessage: FcmMessage) {
        await firebaseApi.sendNotification(fcmMessage);
    }

    async sendNotifications(fcmMulticastMessage: FcmMulticastMessage) {
        await firebaseApi.sendMulticastNotification(fcmMulticastMessage);
    }

    private getFilePath(userId: string) {
        const fileName = 'fcm-token.json';
        return path.join(userDir, `${userId}`, fileName);
    }

    private getDirPath(userId: string) {
        return path.join(userDir, `${userId}`);
    }
}