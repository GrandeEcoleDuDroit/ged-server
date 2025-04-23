const fs = require('fs');
const os = require('os');
const path = require('path');
const FirestoreAPI = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreAPI();
const homeDir = os.homedir();
const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users');
const FCMToken = require('@models/token');

class FcmRepository {
    async upsertToken(token) {
        firestoreAPI.upsertToken(token);
        const dirPath = path.join(userDir, `${token.userId}`);
        const filePath = path.join(`${dirPath}`, FCMToken.fileName());
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, token.value, 'utf8');
    }

    async getTokenValue(userId) {
        const filePath = path.join(userDir, `${userId}`, FCMToken.fileName());
        return fs.readFileSync(filePath, 'utf8');
    }

    async sendNotification(notificationMessage) {
        await firestoreAPI.sendNotification(notificationMessage);
    }
}

module.exports = FcmRepository;