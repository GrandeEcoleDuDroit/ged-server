import type {NextFunction, Request, Response} from 'express';
import FirebaseApi from '@api/firebaseApi';
import { e } from '@utils/logs';
import type {DecodedIdToken} from 'firebase-admin/auth';
import type {ServerResponse} from '@models/serverResponse';
import {invalidFieldsErrorMessage} from '@utils/exceptionUtils';

const firebaseApi = new FirebaseApi();

export const verifyAuthIdToken = (errorMessage: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decodedToken = await getDecodedIdToken(req.headers.authorization);
            req.uid = decodedToken.uid;
            next();
        } catch (error: any) {
            const serverResponse: ServerResponse = {
                message: errorMessage,
                error : error.message
            };

            e(serverResponse.message, error);
            res.status(401).json(serverResponse);
        }
    }
}

export const verifyCustomClaims = (block: (decodedIdToken: DecodedIdToken) => boolean, errorMessage: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const decodedIdToken = await getDecodedIdToken(req.headers.authorization);

            if (block(decodedIdToken)) {
                req.uid = decodedIdToken.uid;
                next();
            } else {
                const serverResponse: ServerResponse = {
                    message: errorMessage,
                    error : 'User does not have required custom claims'
                };

                e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, decodedIdToken)));
                res.status(403).json(serverResponse);
            }
        } catch (error: any) {
            const serverResponse: ServerResponse = {
                message: errorMessage,
                error : error.message
            };

            e(serverResponse.message, error);
            res.status(401).json(serverResponse);
        }
    }
}

export const propagateCustomClaims = (errorMessage: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const uid = req.uid;

        if (!uid) {
            const serverResponse: ServerResponse = {
                message: errorMessage,
                error : 'Missing token uid'
            }

            e(serverResponse.message, new Error(serverResponse.error));
            res.status(401).json(serverResponse);
            return;
        }

        try {
            const userRecord = await firebaseApi
                .getAuth()
                .getUser(uid);

            req.claims = userRecord.customClaims || {};
            next();
        } catch (error: any) {
            const serverResponse: ServerResponse = {
                message: errorMessage,
                error : error.message
            };

            e(serverResponse.message, error);
            res.status(401).json(serverResponse);
        }
    }
}

async function getDecodedIdToken(authorizationHeader: string | undefined): Promise<DecodedIdToken>  {
    const idToken = authorizationHeader?.split('Bearer ')[1] || null;

    if (!idToken) {
        throw new Error('Empty or malformed token');
    }

    return await firebaseApi
        .getAuth()
        .verifyIdToken(idToken);
}