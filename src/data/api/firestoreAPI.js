const FirebaseManager = require('@config/firebaseManager');
const firebaseManager = new FirebaseManager();

const CREDENTIALS_TABLE_NAME = 'credentials';

class FirestoreApi {
    async upsertToken(token) {
        const tokenRef = firebaseManager.firestore().collection(CREDENTIALS_TABLE_NAME).doc(token.userId);
        await tokenRef.set(token.toJson(), { merge: true });
    }

    async sendNotification(notificationMessage) {
        await firebaseManager.sendNotification(notificationMessage)
    }
}

module.exports = FirestoreApi;
