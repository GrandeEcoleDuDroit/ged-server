import { firebaseManager } from "@config/index.ts";
import type { FcmToken } from "@models/fcmToken.ts";
import type { Message } from 'firebase-admin/messaging';

const CREDENTIALS_TABLE_NAME = 'credentials';

export class FirebaseApi {
    async upsertToken(fcmToken: FcmToken) {
        await (await firebaseManager)
            .firestore()
            .collection(CREDENTIALS_TABLE_NAME)
            .doc(fcmToken.userId)
            .set(fcmToken.toJson(), { merge: true });
    }

    async sendNotification(fcmMessage: Message) {
        await (await firebaseManager).sendNotification(fcmMessage);
    }

    async verifyAuthIdToken(idToken: string) {
        return (await firebaseManager).verifyAuthIdToken(idToken);
    }
}