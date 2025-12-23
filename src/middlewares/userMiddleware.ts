import { Request, Response, NextFunction } from 'express';
import { e } from '@utils/logs';

export const createUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'Error creating user',
            error: 'You are not authorized to perform this action.'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
}

export const updateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'Error updating user',
            error: 'You are not authorized to perform this action.'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
}
export const updateProfilePictureFileNameMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'Error updating user',
            error: 'You are not authorized to perform this action.'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
}