import { e } from '#utils/logs.js';
import WhiteListRepository from '#repositories/whiteListRepository.js';
import formatOracleError from '#utils/exceptionUtils.js';

const whiteListRepository = new WhiteListRepository();

export const checkUserWhiteList = async (req, res) => {
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

export default { checkUserWhiteList }