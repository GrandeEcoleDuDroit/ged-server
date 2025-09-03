import { firebaseManager } from "../../config/index.ts";
const CREDENTIALS_TABLE_NAME = 'credentials';
export class FirebaseApi {
    async upsertToken(fcmToken) {
        await firebaseManager.firestore()
            .collection(CREDENTIALS_TABLE_NAME)
            .doc(fcmToken.userId)
            .set(fcmToken.toJson(), { merge: true });
    }
    async sendNotification(fcmMessage) {
        await firebaseManager.sendNotification(fcmMessage);
    }
    async verifyAuthIdToken(idToken) {
        return firebaseManager.verifyAuthIdToken(idToken);
    }
}
