const { e } = require('@utils/logs');
const WhiteListRepository = require('@repositories/whiteListRepository');
const formatOracleError = require('@utils/exceptionUtils')

const whiteListRepository = new WhiteListRepository();

const checkUserWhiteList = async (req, res) => {
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

module.exports = {
    checkUserWhiteList
}