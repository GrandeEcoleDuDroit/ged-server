import dotenv from 'dotenv';
import admin, { messaging } from 'firebase-admin';
import fs from 'fs/promises';
dotenv.config();
const path = process.env['FIREBASE_CREDENTIALS_PATH'];
export class FirebaseManager {
    constructor() { }
    static async getInstance() {
        if (!this.instance) {
            const jsonString = await fs.readFile(path, 'utf-8');
            const serviceAccount = JSON.parse(jsonString);
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
    async sendNotification(message) {
        return await admin.messaging().send(message);
    }
    async verifyAuthIdToken(idToken) {
        return await admin.auth().verifyIdToken(idToken);
    }
}
