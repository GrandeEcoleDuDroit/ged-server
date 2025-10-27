const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);
const CREDENTIALS_TABLE_NAME = 'credentials';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class FirebaseApi {
    async upsertToken(token) {
        await admin.firestore()
            .collection(CREDENTIALS_TABLE_NAME)
            .doc(token.userId)
            .set(token.toJson(), { merge: true });
    }

    async sendNotification(notificationMessage) {
        await admin
            .messaging()
            .send(notificationMessage)
    }

    async verifyAuthIdToken(idToken) {
        await admin
            .auth()
            .verifyIdToken(idToken);
    }
}

module.exports = new FirebaseApi();
