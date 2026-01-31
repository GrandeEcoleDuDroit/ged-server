import type {NextFunction, Request, Response} from 'express';
import {e} from '@utils/logs';
import {badRequestErrorResponse, forbiddenErrorResponse, internalServerErrorResponse} from '@utils/errorUtils';
import MissionRepository from '@repositories/missionRepository';

const missionRepository = new MissionRepository();

const removeParticipantMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tester = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        USER_ID: userId
    } = req.body;

    if (!missionId || !userId) {
        res.status(400).json(badRequestErrorResponse);
        return
    }

    try {
        const mission = await missionRepository.getMission(missionId);
        const missionManagers = await missionRepository.getMissionManagers(missionId);

        if (!mission) {
            res.status(400).json(badRequestErrorResponse('Mission not found'));
            return
        }

        const isAllowed = (): boolean => {
            if (tester != mission.test) return false;
            if (userId == req.uid || req.claims?.admin) return true;
            return missionManagers.some(manager => manager.userId == req.uid);
        }

        if (!isAllowed()) {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        next();
    } catch (error: any) {
        e(new Error(`Error removing participant from mission ${missionId}: ${error.message}`),);
        res.status(500).json(internalServerErrorResponse);
    }
}

export default removeParticipantMiddleware;