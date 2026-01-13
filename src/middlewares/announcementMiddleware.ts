import type {NextFunction, Request, Response} from 'express';
import {forbiddenErrorResponse} from '@utils/errorUtils';

export const updateAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    next();
};

export const deleteAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    next();
};