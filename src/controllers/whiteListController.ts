import { e } from '@utils/logs';
import { WhiteListRepository } from '@repositories/whiteListRepository';
import {formatOracleError, getErrorOrDefault} from '@utils/exceptionUtils';
import type { Request, Response } from 'express';

const whiteListRepository = new WhiteListRepository();

export const checkUserWhiteList = async (req: Request, res: Response) => {
    const userEmail: string = req.body.USER_EMAIL;

    if (!userEmail) {
        const serverResponse = {
            message: 'Error checking user white list',
            error: `
                User email is required :
                {
                  userEmail: ${userEmail},
                }`
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const isWhiteListed = await whiteListRepository.checkUserWhiteList(userEmail);
        return res.status(200).send(isWhiteListed);
    }
    catch (err) {
        const error = getErrorOrDefault(err)
        const serverResponse = formatOracleError(error, 'Error checking user white list');
        e(serverResponse.message, error);
        return res.status(500).json(serverResponse);
    }
}

export default { checkUserWhiteList }