const admin = require('firebase-admin');
const path = require('path');
const serviceAccountPath = path.resolve(process.env.FIREBASE_CREDENTIALS_PATH);

class FirebaseManager {
    constructor() {
        if (FirebaseManager.instance) {
            return FirebaseManager.instance;
        }

        FirebaseManager.instance = this;
        this.initialize();
    }

    initialize() {
        if (!this.app) {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(require(serviceAccountPath))
            });
        }
    }

    firestore() {
        return admin.firestore();
    }

    async sendNotification(message) {
        await admin
            .messaging()
            .send(message)
    }
}

module.exports = FirebaseManager;