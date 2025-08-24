import FirestoreApi from '#data/api/firestoreAPI.js';
import { e } from '#utils/logs.js';

const firestoreAPI = new FirestoreApi();

export const verifyAuthIdToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid or malformed token.' });
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

export default { verifyAuthIdToken };