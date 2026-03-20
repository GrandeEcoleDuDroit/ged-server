import type {NextFunction, Request, Response} from 'express';
import {e} from '@utils/logs';
import {badRequestErrorResponse, forbiddenErrorResponse, internalServerErrorResponse} from '@utils/errorUtils';
import MissionRepository from '@repositories/missionRepository';
import {MissionErrorCodes} from "@data/error/missionErrorCodes";

const deleteMissionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const missionId = req.params.missionId;

    if (!missionId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const isAdmin = req.claims?.admin ?? false;
        if (!isAdmin)  {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        next();
    } catch (error: any) {
        e(new Error(`Error deleting mission ${missionId}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
}

export default deleteMissionMiddleware;