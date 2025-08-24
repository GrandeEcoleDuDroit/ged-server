import fs from 'fs';
import os from 'os';
import path from 'path';
import FirestoreApi from '#data/api/firestoreAPI.js';
import FcmToken from '#models/token.js';

const firestoreAPI = new FirestoreApi();
const homeDir = os.homedir();
const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users');

class FcmRepository {
    async upsertToken(token) {
        firestoreAPI.upsertToken(token);
        const dirPath = path.join(userDir, `${token.userId}`);
        const filePath = path.join(`${dirPath}`, FcmToken.fileName());
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, token.value, 'utf8');
    }

    async getTokenValue(userId) {
        const filePath = path.join(userDir, `${userId}`, FcmToken.fileName());
        return fs.readFileSync(filePath, 'utf8');
    }

    async sendNotification(notificationMessage) {
        await firestoreAPI.sendNotification(notificationMessage);
    }
}

export default FcmRepository;