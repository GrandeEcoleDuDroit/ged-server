import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import {formatOracleError, invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import BlockedUserRepository from '@repositories/blockedUserRepository';
import type {ServerResponse} from '@models/serverResponse';

const blockedUserRepository = new BlockedUserRepository();

export const getBlockedUserIds = async (req: Request, res: Response) => {
    const userId = req.uid;
    if (!userId) {
        const serverResponse: ServerResponse = {
            message: 'Error getting blocked user ids',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const userIds = await blockedUserRepository.getBlockedUserIds(userId)
        res.status(200).json(userIds);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error getting blocked user ids', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const addBlockedUser = async (req: Request, res: Response) => {
    const userId = req.uid;
    const blockedUserId = req.body.BLOCKED_USER_ID;

    if (!userId || !blockedUserId) {
        const serverResponse: ServerResponse = {
            message: 'Error adding blocked user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await blockedUserRepository.addBlockedUser(userId, blockedUserId)
        const serverResponse: ServerResponse = { message: 'Blocked user has been added successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error adding blocked user',
            error: error.message
        };
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const removeBlockedUser = async (req: Request, res: Response) => {
    const userId = req.uid;
    const blockedUserId = req.params.userId;

    if (!userId) {
        const serverResponse: ServerResponse = {
            message: 'Error removing blocked user',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await blockedUserRepository.removeBlockedUser(userId, blockedUserId)
        const serverResponse: ServerResponse = { message: 'Blocked user has been removed successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error removing blocked user',
            error: error.message
        };
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}