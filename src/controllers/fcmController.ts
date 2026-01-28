import type { Request, Response } from 'express';
import {d, e} from '@utils/logs';
import FcmRepository from '@repositories/fcmRepository';
import type {ServerResponse} from '@models/serverResponse';
import {badRequestErrorResponse, oracleErrorResponse} from "@utils/errorUtils";
import {toFcmMessage, toFcmMulticastMessage} from "@data/mappers/fcmMapper";

const fcmRepository = FcmRepository.instance;

export const addToken = async (req: Request, res: Response): Promise<void> => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await fcmRepository.upsertFcmToken(userId, token);
        const serverResponse: ServerResponse = { message: 'Fcm token has been added successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error adding fcm token of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};

export const deleteToken = async (req: Request, res: Response): Promise<void> => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await fcmRepository.deleteFcmToken(userId, token);
        const serverResponse: ServerResponse = { message: 'Fcm token has been deleted successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error deleting fcm token of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    const { recipientId: recipientId, fcmMessage: fcmMessageJson} = req.body;

    if (!fcmMessageJson) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const tokens = fcmRepository.userFcmTokens.get(recipientId);
        if (tokens && tokens.size > 0) {
            const tokensArray = Array.from(tokens);
            const fcmMessageObject = JSON.parse(fcmMessageJson);

            if (tokensArray.length == 1) {
                await fcmRepository.sendNotification(toFcmMessage(fcmMessageObject, tokensArray[0]));
            } else {
                await fcmRepository.sendNotifications(toFcmMulticastMessage(fcmMessageObject, tokensArray))
            }
        } else {
            const serverResponse: ServerResponse = { message: 'Cannot send notification: No token found for the recipient' };
            res.status(201).json(serverResponse);
            return;
        }

        const serverResponse: ServerResponse = { message: 'Notification has been sent successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error sending notification to user ${recipientId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};