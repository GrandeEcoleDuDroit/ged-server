import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import WhiteListRepository from '@repositories/whiteListRepository';
import {formatOracleError, invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import type {ServerResponse} from '@models/serverResponse';

const whiteListRepository = new WhiteListRepository();

export const verifyUserWhiteList = async (req: Request, res: Response) => {
    const userEmail = req.body.USER_EMAIL;

    if (!userEmail) {
        const serverResponse: ServerResponse = {
            message: 'Error verifying user white list',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const isWhiteListed = await whiteListRepository.isUserWhiteListed(userEmail);
        res.status(200).send(isWhiteListed);
    } catch (error) {
        const serverResponse: ServerResponse = formatOracleError('Error verifying user white list', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}