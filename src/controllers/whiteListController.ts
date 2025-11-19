import { Request, Response } from 'express';
import { e } from '@utils/logs';
import WhiteListRepository from '@repositories/whiteListRepository';
import { formatOracleError } from '@utils/exceptionUtils';

const whiteListRepository = new WhiteListRepository();

export const checkUserWhiteList = async (req: Request, res: Response) => {
    const userEmail = req.body.USER_EMAIL;

    try {
        const isWhiteListed = await whiteListRepository.checkUserWhiteList(userEmail);
        res.status(200).send(isWhiteListed);
    }
    catch (error) {
        const serverResponse = formatOracleError(error, 'Error checking user white list');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}