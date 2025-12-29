import { Request, Response } from 'express';
import { e } from '@utils/logs';
import { formatOracleError } from '@utils/exceptionUtils';
import BlockedUserRepository from '@repositories/blockedUserRepository';

const blockedUserRepository = new BlockedUserRepository();

export const getBlockedUserIds = async (req: Request, res: Response) => {
    const userId = req.uid;
    if (!userId) {
        const serverResponse = {
            message: "Error getting blocked user ids",
            error: `
            Some missing fields :
            {
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const userIds = await blockedUserRepository.getBlockedUserIds(userId)
        res.status(200).json(userIds);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error getting blocked user ids');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const addBlockedUser = async (req: Request, res: Response) => {
    const userId = req.uid;
    const blockedUserId = req.body.BLOCKED_USER_ID;

    if (!userId) {
        const serverResponse = {
            message: "Error adding blocked user",
            error: `
            Some missing fields :
            {
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await blockedUserRepository.addBlockedUser(userId, blockedUserId)
        const serverResponse = {
            message: `Blocked user has been added successfully`
        };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
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
        const serverResponse = {
            message: "Error removing blocked user",
            error: `
            Some missing fields :
            {
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await blockedUserRepository.removeBlockedUser(userId, blockedUserId)
        const serverResponse = {
            message: `Blocked user has been removed successfully`
        };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error removing blocked user',
            error: error.message
        };
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}