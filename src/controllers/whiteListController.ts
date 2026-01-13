import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import WhiteListRepository from '@repositories/whiteListRepository';
import {oracleErrorResponse, badRequestErrorResponse} from '@utils/errorUtils';

const whiteListRepository = new WhiteListRepository();

export const verifyUserWhiteList = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.body.USER_EMAIL;

    if (!userEmail) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const isWhiteListed = await whiteListRepository.isUserWhiteListed(userEmail);
        res.status(200).send(isWhiteListed);
    } catch (error: any) {
        e(new Error(`Error verifying user white list of ${userEmail}: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}