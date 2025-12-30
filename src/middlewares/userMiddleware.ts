import type { Request, Response, NextFunction } from 'express';
import { e } from '@utils/logs';
import type {ServerResponse} from '@models/serverResponse';
import WhiteListRepository from '@repositories/whiteListRepository';
import {invalidFieldsErrorMessage, missMatchTokenIdErrorMessage} from '@utils/exceptionUtils';

const whiteListRepository = new WhiteListRepository();

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {
        USER_ID: userId,
        USER_EMAIL: userEmail
    } = req.body;

    if (!userId || !userEmail) {
        const serverResponse: ServerResponse = {
            message: 'Error creating user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, { userId, userEmail })));
        res.status(403).json(serverResponse);
        return;
    }

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error creating user',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    try {
        const isWhiteListed = await whiteListRepository.isUserWhiteListed(userEmail);
        if (!isWhiteListed) {
            const serverResponse: ServerResponse = {
                message: 'Error creating user',
                error: 'Unauthorized user'
            };

            e(serverResponse.message, new Error(`User : ${userEmail} is not white-listed.`));
            res.status(403).json(serverResponse);
            return;
        }

    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error creating user',
            error: error.message
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(403).json(serverResponse);
        return;
    }

    next();
}

export const updateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.USER_ID;

    if (!userId) {
        const serverResponse: ServerResponse = {
            message: 'Error creating user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, { userId })));
        res.status(403).json(serverResponse);
        return;
    }

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error updating user',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    next();
}
export const updateProfilePictureMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.USER_ID;

    if (!userId) {
        const serverResponse: ServerResponse = {
            message: 'Error updating profile picture',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, { userId })));
        res.status(403).json(serverResponse);
        return;
    }

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error updating profile picture',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    next();
}