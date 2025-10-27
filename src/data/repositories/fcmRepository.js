const fs = require('fs');
const os = require('os');
const path = require('path');
const firebaseApi = require('@api/firebaseApi');
const userDir = path.join(`${os.homedir()}`, 'gedoise-data', 'users');
const FcmToken = require('@models/fcmToken');

class FcmRepository {
    async upsertToken(fcmToken) {
        firebaseApi.upsertToken(fcmToken);
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

    async sendNotification(notificationMessage) {
        await firebaseApi.sendNotification(notificationMessage);
    }
}

module.exports = new FcmRepository();