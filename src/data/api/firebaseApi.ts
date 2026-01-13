import admin, {type ServiceAccount} from 'firebase-admin';
import type {FcmMessage, FcmMulticastMessage} from '@models/fcmMessage';
import {Auth} from 'firebase-admin/auth';
import {toMessage, toMulticastMessage} from "@data/mappers/fcmMapper";
import {firebaseCredentials} from "@api/configs";

admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials as ServiceAccount)
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