import BlockedUserRepository from "@repositories/blockedUserRepository";
import {forbiddenErrorResponse} from "@utils/errorUtils";
import type {NextFunction, Request, Response} from "express";

const blockedUserRepository = BlockedUserRepository.instance;

export const sendNotificationMiddleware= (req: Request, res: Response, next: NextFunction): void => {
    const {
        userId: senderId,
        recipientId: recipientId
    } = req.body;

    if (senderId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    const blockedUserIds = blockedUserRepository.blockedUserIds.get(recipientId);
    if (blockedUserIds?.includes(senderId)) {
        res.status(201);
        return;
    }

    next();
};