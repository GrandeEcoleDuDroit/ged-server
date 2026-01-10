import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import {oracleErrorResponse, badRequestErrorResponse} from '@utils/errorUtils';
import BlockedUserRepository from '@repositories/blockedUserRepository';
import type {ServerResponse} from '@models/serverResponse';

const blockedUserRepository = BlockedUserRepository.instance;

export const getBlockedUserIds = async (req: Request, res: Response): Promise<void> => {
    const userId = req.uid;

    if (!userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const userIds = await blockedUserRepository.getBlockedUserIds(userId)
        res.status(200).json(userIds);
    } catch (error: any) {
        e(new Error(`Error getting blocked user ids of ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const addBlockedUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.uid;
    const blockedUserId = req.body.BLOCKED_USER_ID;

    if (!userId || !blockedUserId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await blockedUserRepository.addBlockedUser(userId, blockedUserId)
        const serverResponse: ServerResponse = { message: 'Blocked user has been added successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error adding blocked user ${blockedUserId} of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const removeBlockedUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.uid;
    const blockedUserId = req.params.userId;

    if (!userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await blockedUserRepository.removeBlockedUser(userId, blockedUserId)
        const serverResponse: ServerResponse = { message: 'Blocked user has been removed successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error removing blocked user ${blockedUserId} of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}