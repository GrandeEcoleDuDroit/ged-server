import {NextFunction, Request, Response} from 'express';
import FirebaseApi from '@api/firebaseApi';
import { e } from '@utils/logs';

const firebaseApi = new FirebaseApi();

export const verifyAuthIdToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader != null || !authHeader!!.startsWith('Bearer ')) {
        const serverResponse = {
            message: 'Invalid or malformed token',
            error : "Auth header required"
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(401).json(serverResponse);
    }

    const idToken = authHeader!!.split('Bearer ')[1];

    try {
        await firebaseApi.verifyAuthIdToken(idToken);
        next();
    } catch (error: any) {
        const serverResponse = {
            message: 'Invalid or expired token',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(401).json(serverResponse);
    }
}