import { Request, Response, NextFunction } from 'express';
import { e } from '@utils/logs';

export const createUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'You are not authorized to perform this action.',
            error: 'Error updating user'
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
            message: 'You are not authorized to perform this action.',
            error: 'Error updating user'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
}
export const updateProfilePictureMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.USER_ID;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'You are not authorized to perform this action.',
            error: 'Error updating user'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
}