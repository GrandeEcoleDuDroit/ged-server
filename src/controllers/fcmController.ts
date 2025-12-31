import type { Request, Response } from 'express';
import {d, e} from '@utils/logs';
import FcmRepository from '@repositories/fcmRepository';
import type {ServerResponse} from '@models/serverResponse';
import {invalidFieldsErrorMessage} from "@utils/exceptionUtils";
import {toFcmMessage, toFcmMulticastMessage} from "@data/mappers/fcmMapper";

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
        await fcmRepository.addToken(userId, token);
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

export const deleteToken = async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting fcm token',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await fcmRepository.deleteToken(userId, token);
        const serverResponse: ServerResponse = { message: 'Fcm token has been deleted successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting fcm token',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

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
        const token = await fcmRepository.getFcmToken(recipientId);
        const fcmMessageObject = JSON.parse(fcmMessageJson);

        if (token && token.tokens.length > 0) {
            if (token.tokens.length == 1) {
                await fcmRepository.sendNotification(toFcmMessage(fcmMessageObject, token.tokens[0]));
            } else {
                await fcmRepository.sendNotifications(toFcmMulticastMessage(fcmMessageObject, token.tokens))
            }
        } else {
            const message = `Cannot send notification: No tokens found for the recipient`;
            const serverResponse: ServerResponse = { message: message };
            d(message + ': ' + recipientId);
            res.status(201).json(serverResponse);
            return;
        }

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