import { e } from '@utils/logs';
import { FcmRepository } from '@repositories/fcmRepository';
import { FcmToken } from '@models/fcmToken';
import type { Request, Response } from 'express';
import type { FcmMessage } from "@models/fcmMessage.ts";

const fcmRepository = new FcmRepository();

export const addToken = async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        const serverResponse = {
            message: "Error to add fcm token",
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

        const serverResponse = { message: 'Fcm token added successfully' };
        return res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = {
            message: 'Error adding fcm token',
            error: (error as Error).message || 'Unknown error'
        };

        e(serverResponse.message, error as Error);
        return res.status(500).json(serverResponse);
    }
};

export const sendNotification = async (req: Request, res: Response) => {
    let { recipientId, fcmMessageJson } = req.body;

    if (!fcmMessageJson) {
        const serverResponse = {
            message: "Error to send notification",
            error: `
                Missing field:
                {
                  fcmMessageJson: ${fcmMessageJson},
                }
             `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = await fcmRepository.getTokenValue(recipientId);
        const fcmMessage = JSON.parse(fcmMessageJson) as FcmMessage;
        await fcmRepository.sendNotification(fcmMessage, fcmToken);

        const serverResponse = { message: 'Notification sent successfully' };
        return res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = {
            message: 'Error sending notification',
            error: (error as Error).message || 'Unknown error',
        };

        e(serverResponse.message, error as Error);
        return res.status(500).json(serverResponse);
    }
};

export default {
    addToken,
    sendNotification
};