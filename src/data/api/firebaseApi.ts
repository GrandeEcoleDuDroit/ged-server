import admin, {type ServiceAccount} from 'firebase-admin';
import type {FcmMessage, FcmMulticastMessage} from '@models/fcmMessage';
import serviceAccount from '@root/firebase_credentials.json';
import {Auth} from 'firebase-admin/auth';
import {toMessage, toMulticastMessage} from "@data/mappers/fcmMapper";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export default class FirebaseApi {
    getAuth(): Auth {
        return admin.auth()
    }

    getFirestore(): FirebaseFirestore.Firestore {
        return admin.firestore()
    }

    async sendNotification(fcmMessage: FcmMessage) {
        await admin
            .messaging()
            .send(toMessage(fcmMessage))
    }

    async sendMulticastNotification(fcmMulticastMessage: FcmMulticastMessage) {
        await admin
            .messaging()
            .sendEachForMulticast(toMulticastMessage(fcmMulticastMessage))
    }
}