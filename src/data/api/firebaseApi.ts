import admin, {ServiceAccount} from 'firebase-admin';
import {Message} from "firebase-admin/messaging";
import type FcmToken from '@models/fcmToken';
import {FcmMessage} from "@models/fcmMessage";
import serviceAccount from '@root/firebase_credentials.json';
import {Auth} from "firebase-admin/auth";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export default class FirebaseApi {
    async upsertToken(token: FcmToken) {
        await admin.firestore()
            .collection('credentials')
            .doc(token.userId)
            .set(token.toJson(), { merge: true });
    }

    async sendNotification(fcmMessage: FcmMessage) {
        const message: Message = {
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.android.priority,
                notification: {
                    channelId: fcmMessage.android.notification.channelId,
                    icon: fcmMessage.android.notification.icon
                }
            },
            apns: {
                headers: {
                    "apns-priority": fcmMessage.apns.headers.apnsPriority,
                    "apns-collapse-id": fcmMessage.apns.headers.apnsCollapseId
                },
                payload: {
                    aps: {
                        alert: {
                            title: fcmMessage.apns.payload.aps.alert.title,
                            body: fcmMessage.apns.payload.aps.alert.body
                        },
                        sound: fcmMessage.apns.payload.aps.sound,
                        badge: fcmMessage.apns.payload.aps.badge
                    }
                }
            },
            token: fcmMessage.token
        };

        await admin
            .messaging()
            .send(message)
    }

    getAuth(): Auth {
        return admin.auth()
    }
}