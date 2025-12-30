import type {NextFunction, Request, Response} from 'express';
import {e} from '@utils/logs';
import type {ServerResponse} from '@models/serverResponse';
import {missMatchTokenIdErrorMessage} from '@utils/exceptionUtils';

export const updateAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error updating announcement',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    next();
};

export const deleteUserAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting user announcement',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    next();
};

export const deleteAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting announcement',
            error: 'You are not authorized to perform this action'
        };

        e(serverResponse.message, new Error(missMatchTokenIdErrorMessage(userId, req.uid)));
        res.status(403).json(serverResponse);
        return;
    }

    next();
};