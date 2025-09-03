import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs/promises';
import type { ServiceAccount } from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';

dotenv.config();

const path = process.env['FIREBASE_CREDENTIALS_PATH'] as string;

export class FirebaseManager {
    private static instance: FirebaseManager;
    private static app: admin.app.App;

    private constructor() {}

    static async getInstance() {
        if (!this.instance) {
            const jsonString = await fs.readFile(path, 'utf-8');
            const serviceAccount = JSON.parse(jsonString) as ServiceAccount;

            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            this.instance = new FirebaseManager();
        }

        return this.instance;
    }

    firestore() {
        return admin.firestore();
    }

    async sendNotification(message: Message) {
        return await admin.messaging().send(message);
    }

    async verifyAuthIdToken(idToken: string) {
        return await admin.auth().verifyIdToken(idToken);
    }
}