import { Request, Response } from 'express';
import { e } from '@utils/logs';
import FcmRepository from '@repositories/fcmRepository';
import FcmToken from '@models/fcmToken';
import type { FcmMessage } from "@models/fcmMessage";

const fcmRepository = new FcmRepository();

export const addToken = async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        const serverResponse = {
            message: "Error to add FCM token",
            error: `
            Some missing fields: 
            {
                userId: ${userId},
                token: ${token}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = new FcmToken(userId, token);
        await fcmRepository.upsertToken(fcmToken);

        const serverResponse = { message: 'FCM token added successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error adding FCM token',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const sendNotification = async (req: Request, res: Response) => {
    const { recipientId, fcmMessage: fcmMessageJson } = req.body;

    if (!fcmMessageJson) {
        const serverResponse = {
            message: "Error to send notification",
            error: `
            Missing field: 
            {
                fcmMessage: ${fcmMessageJson}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
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

        const serverResponse = { message: 'Notification sent successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error sending notification',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};