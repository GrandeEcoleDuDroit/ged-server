const FirebaseManager = require('@data/firebaseManager');
const firebaseManager = new FirebaseManager();

const TOKEN_TABLE_NAME = 'token';

class FirestoreAPI {
    async upsertToken(token) {
        const tokenRef = firebaseManager.firestore().collection(TOKEN_TABLE_NAME).doc(token.userId);
        await tokenRef.set({
            ...token.toJson()
        }, { merge: true });
    }

    async sendNotification(notificationMessage) {
        await firebaseManager.sendNotification(notificationMessage)
    }
}

module.exports = FirestoreAPI;
