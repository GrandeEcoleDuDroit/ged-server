import dotenv from 'dotenv';
dotenv.config();
import admin  from 'firebase-admin';
import fs from 'fs/promises';

const path = process.env.FIREBASE_CREDENTIALS_PATH;

class FirebaseManager {
    constructor() {
        if (!FirebaseManager.instance) {
            throw new Error('FirebaseManager not initialized yet use getInstance().');
        }
        return this;
    }

    static async getInstance() {
        if (!this.app) {
            const jsonString = await fs.readFile(path, 'utf-8');
            const serviceAccount = JSON.parse(jsonString);
            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            FirebaseManager.instance = this;
            return this;
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

export default FirebaseManager;