import firebaseManager from '#config/index.js';

const CREDENTIALS_TABLE_NAME = 'credentials';

class FirestoreApi {
    async upsertToken(token) {
        const tokenRef = firebaseManager.firestore()
            .collection(CREDENTIALS_TABLE_NAME)
            .doc(token.userId);
        await tokenRef.set(token.toJson(), { merge: true });
    }

    async sendNotification(notificationMessage) {
        await firebaseManager.sendNotification(notificationMessage);
    }

    async verifyAuthIdToken(idToken) {
        return firebaseManager.verifyAuthIdToken(idToken);
    }
}

export default FirestoreApi;
