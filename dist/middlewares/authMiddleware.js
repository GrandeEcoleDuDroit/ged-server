import { FirebaseApi } from '../data/api/firebaseApi.ts';
import { e } from '../utils/logs.ts';
import { getErrorOrDefault } from "../utils/exceptionUtils.ts";
const firebaseApi = new FirebaseApi();
export const verifyAuthIdToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const serverResponse = {
            message: 'Failed to verify auth id token',
            error: 'No token provided or malformed authorization header'
        };
        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(401).json(serverResponse);
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        if (!idToken)
            throw new Error('No token provided');
        await firebaseApi.verifyAuthIdToken(idToken);
        return next();
    }
    catch (err) {
        const error = getErrorOrDefault(err);
        const serverResponse = {
            message: 'Failed to verify auth id token',
            error: error.message
        };
        e(serverResponse.message, error);
        return res.status(401).json(serverResponse);
    }
};
export default { verifyAuthIdToken };
