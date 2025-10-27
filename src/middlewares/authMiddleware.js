const firebaseApi = require('@api/firebaseApi');
const { e } = require('@utils/logs')

const verifyAuthIdToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const serverResponse = {
            message: 'Invalid or malformed token',
            error : "auth header required"
        };

        e(serverResponse.message);
        res.status(401).json(serverResponse);
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        req.user = await firebaseApi.verifyAuthIdToken(idToken);
        next();
    } catch (error) {
        const serverResponse = {
            message: 'Invalid or expired token',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(401).json(serverResponse);
    }
}

module.exports = {
    verifyAuthIdToken
};