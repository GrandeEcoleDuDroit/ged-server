const FirestoreApi = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreApi();
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
        const decodedToken = await firestoreAPI.verifyAuthIdToken(idToken);
        req.user = decodedToken;
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