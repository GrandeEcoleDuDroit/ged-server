import type { Request, Response, NextFunction } from 'express';
import { e } from '@utils/logs';
import WhiteListRepository from '@repositories/whiteListRepository';
import {badRequestErrorResponse, forbiddenErrorResponse, oracleErrorResponse} from '@utils/errorUtils';

const whiteListRepository = new WhiteListRepository();

export const createUserMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
        USER_ID: userId,
        USER_EMAIL: userEmail
    } = req.body;

    if (!userId || !userEmail) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    if (userId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    try {
        const isWhiteListed = await whiteListRepository.isUserWhiteListed(userEmail);
        if (!isWhiteListed) {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

    } catch (error: any) {
        e(new Error(`Error verifying user whit list for ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
        return;
    }

    next();
}

export const updateProfilePictureMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const userId = req.body.USER_ID;

    if (!userId) {
        res.status(403).json(badRequestErrorResponse);
        return;
    }

    if (userId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    next();
}