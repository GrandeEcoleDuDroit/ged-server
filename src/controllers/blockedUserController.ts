import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import {oracleErrorResponse, badRequestErrorResponse} from '@utils/errorUtils';
import BlockedUserRepository from '@repositories/blockedUserRepository';
import type {ServerResponse} from '@models/serverResponse';
import type BlockedUser from "@models/user/blockedUser";

const blockedUserRepository = BlockedUserRepository.instance;

export const getBlockedUserIds = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;

    if (!userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const blockedUsers = await blockedUserRepository.getBlockedUsers(userId)
        res.status(200).json(blockedUsers);
    } catch (error: any) {
        e(new Error(`Error getting blocked users of ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const addBlockedUser = async (req: Request, res: Response): Promise<void> => {
    const {
        USER_ID: userId,
        BLOCKED_USER_ID: blockedUserId,
        BLOCKED_DATE: date
    } = req.body;

    if (
        !userId ||
        !blockedUserId ||
        !date
    ) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    const blockedUser: BlockedUser = {
        USER_ID: userId,
        BLOCKED_USER_ID: blockedUserId,
        BLOCKED_DATE: date
    }

    try {
        await blockedUserRepository.addBlockedUser(blockedUser)
        const serverResponse: ServerResponse = { message: 'Blocked user has been added successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error adding blocked user ${blockedUserId} of user ${userId}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

export const removeBlockedUser = async (req: Request, res: Response): Promise<void> => {
    const {
        USER_ID: userId,
        BLOCKED_USER_ID: blockedUserId
    } = req.body;

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