import type {NextFunction, Request, Response} from 'express';
import FirebaseApi from '@api/firebaseApi';
import type {DecodedIdToken} from 'firebase-admin/auth';
import {forbiddenErrorResponse, unauthorizedErrorResponse} from '@utils/errorUtils';

const firebaseApi = new FirebaseApi();

export const verifyAuthIdToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const decodedToken = await getDecodedIdToken(req.headers.authorization);
        req.uid = decodedToken.uid;
        next();
    } catch (error: any) {
        res.status(401).json(unauthorizedErrorResponse);
    }
}

export const verifyCustomClaims = (block: (decodedIdToken: DecodedIdToken) => boolean) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const decodedIdToken = await getDecodedIdToken(req.headers.authorization);

            if (block(decodedIdToken)) {
                req.uid = decodedIdToken.uid;
                next();
            } else {
                res.status(403).json(forbiddenErrorResponse('User does not have required permissions'));
            }
        } catch (error: any) {
            res.status(401).json(unauthorizedErrorResponse);
        }
    }
}

export const propagateCustomClaims = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const uid = req.uid;

    if (!uid) {
        res.status(401).json(unauthorizedErrorResponse);
        return;
    }

    try {
        const userRecord = await firebaseApi
            .getAuth()
            .getUser(uid);

        req.claims = userRecord.customClaims || {};
        next();
    } catch (error: any) {
        res.status(401).json(unauthorizedErrorResponse);
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