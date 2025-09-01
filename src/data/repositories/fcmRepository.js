const fs = require('fs');
const os = require('os');
const path = require('path');
const FirestoreApi = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreApi();
const userDir = path.join(`${os.homedir()}`, 'gedoise-data', 'users');
const FcmToken = require('@models/token');

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

module.exports = FcmRepository;