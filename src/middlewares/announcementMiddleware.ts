import {NextFunction, Request, Response} from "express";
import {e} from "@utils/logs";

export const updateAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
};

export const deleteUserAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'You are not authorized to perform this action.',
            error: 'Error deleting user announcement'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
};

export const deleteAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        const serverResponse = {
            message: 'You are not authorized to perform this action.',
            error: 'Error deleting announcement'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(403).json(serverResponse);
    } else {
        next();
    }
};