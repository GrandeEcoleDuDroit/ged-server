const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

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
                credential: admin.credential.cert(serviceAccount)
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

    async verifyAuthIdToken(idToken) {
        await admin.auth().verifyIdToken(idToken);
    }
}

module.exports = FirebaseManager;