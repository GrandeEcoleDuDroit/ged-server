import admin from 'firebase-admin';
import type {FcmMessage, FcmMulticastMessage} from '@models/fcmMessage';
import {Auth} from 'firebase-admin/auth';
import {toMessage, toMulticastMessage} from "@data/mappers/fcmMapper";
import {GOOGLE_CLOUD_PROJECT} from '@root/env';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: GOOGLE_CLOUD_PROJECT
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