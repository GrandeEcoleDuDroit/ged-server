import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import FcmRepository from '@repositories/fcmRepository';
import FcmToken from '@models/fcmToken';
import type { FcmMessage } from '@models/fcmMessage';
import type {ServerResponse} from '@models/serverResponse';
import {invalidFieldsErrorMessage} from "@utils/exceptionUtils";

const fcmRepository = new FcmRepository();

export const addToken = async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        const serverResponse: ServerResponse = {
            message: 'Error adding fcm token',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const fcmToken = new FcmToken(userId, token);
        await fcmRepository.upsertToken(fcmToken);

        const serverResponse: ServerResponse = { message: 'Fcm token has been added successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error adding fcm token',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const sendNotification = async (req: Request, res: Response) => {
    const { recipientId, fcmMessage: fcmMessageJson } = req.body;

    if (!fcmMessageJson) {
        const serverResponse: ServerResponse = {
            message: 'Error sending notification',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const token = await fcmRepository.getTokenValue(recipientId);
        const fcmMessageObject = JSON.parse(fcmMessageJson);

        const fcmMessage: FcmMessage = {
            data: {
                type: fcmMessageObject.data.type,
                value: JSON.stringify(fcmMessageObject.data.value)
            },
            android: {
                priority: fcmMessageObject.android.priority,
                notification: {
                    channelId: fcmMessageObject.android.notification.channelId,
                    icon: fcmMessageObject.android.notification.icon
                }
            },
            apns: {
                headers: {
                    apnsPriority: fcmMessageObject.apns.headers.apnsPriority,
                    apnsCollapseId: fcmMessageObject.apns.headers.apnsCollapseId
                },
                payload: {
                    aps: {
                        alert: {
                            title: fcmMessageObject.apns.payload.aps.alert.title,
                            body: fcmMessageObject.apns.payload.aps.alert.body
                        },
                        sound: fcmMessageObject.apns.payload.aps.sound,
                        badge: fcmMessageObject.apns.payload.aps.badge
                    }
                }
            },
            token: token
        };

        await fcmRepository.sendNotification(fcmMessage);

        const serverResponse: ServerResponse = { message: 'Notification has been sent successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error sending notification',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};