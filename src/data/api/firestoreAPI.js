const firebaseManager = require('@data/firebaseManager');

const CREDENTIALS_TABLE_NAME = 'credentials';

class FirestoreAPI {
    async upsertToken(token) {
        const tokenRef = firebaseManager.firestore().collection(CREDENTIALS_TABLE_NAME).doc(token.userId);
        await tokenRef.set({
            ...token.toJson()
        }, { merge: true });
    }
}

module.exports = FirestoreAPI;
