import { e } from '../utils/logs.ts';
import { WhiteListRepository } from '../data/repositories/whiteListRepository.ts';
import { formatOracleError, getErrorOrDefault } from '../utils/exceptionUtils.ts';
const whiteListRepository = new WhiteListRepository();
export const checkUserWhiteList = async (req, res) => {
    const userEmail = req.body.USER_EMAIL;
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
        const error = getErrorOrDefault(err);
        const serverResponse = formatOracleError(error, 'Error checking user white list');
        e(serverResponse.message, error);
        return res.status(500).json(serverResponse);
    }
};
export default { checkUserWhiteList };
