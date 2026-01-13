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
        await fcmRepository.addToken(userId, token);
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
        await fcmRepository.deleteToken(userId, token);
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
        const tokens = fcmRepository.fcmTokens.get(recipientId);
        const fcmMessageObject = JSON.parse(fcmMessageJson);

        if (tokens && tokens.length > 0) {
            if (tokens.length == 1) {
                await fcmRepository.sendNotification(toFcmMessage(fcmMessageObject, tokens[0]));
            } else {
                await fcmRepository.sendNotifications(toFcmMulticastMessage(fcmMessageObject, tokens))
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