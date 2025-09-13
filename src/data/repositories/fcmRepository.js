const fs = require('fs');
const os = require('os');
const path = require('path');
const FirestoreApi = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreApi();
const userDir = path.join(`${os.homedir()}`, 'gedoise-data', 'users');
const FcmToken = require('@models/token');
const notificationFileName = 'notifications.json';

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

    async sendNotification(fcmMessage, recipientId, notificationGroupId) {
        const notifications = await this.#getNotifications(recipientId)

        if (notifications.size > 1) {
            fcmMessage.apns.payload.aps.badge = notifications.size
        } else {
            fcmMessage.apns.payload.aps.badge = 1
        }

        await firestoreAPI.sendNotification(fcmMessage);
        if (!notifications.has(notificationGroupId)) {
            notifications.set(notificationGroupId, true);
            await this.#storeNotification(recipientId, notifications);
        }
    }

    async removeNotification(userId, notificationGroupId) {
        const notifications = await this.#getNotifications(userId)
        if (notifications.has(notificationGroupId)) {
            notifications.delete(notificationGroupId);
            await this.#storeNotification(userId, notifications);
        }
    }

    async #storeNotification(userId, notificationMap) {
        const dirPath = path.join(userDir, `${userId}`);
        const filePath = path.join(`${dirPath}`, notificationFileName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const notificationJson = JSON.stringify(Array.from(notificationMap));
        fs.writeFileSync(filePath, notificationJson, 'utf8');
    }

    async #getNotifications(userId) {
        const filePath = path.join(userDir, `${userId}`, notificationFileName);
        try {
            const notificationJson = fs.readFileSync(filePath, 'utf8');
            return new Map(JSON.parse(notificationJson));
        } catch (error) {
            return new Map();
        }
    }
}

module.exports = FcmRepository;