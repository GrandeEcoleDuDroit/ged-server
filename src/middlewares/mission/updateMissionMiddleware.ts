import type {NextFunction, Request, Response} from 'express';
import {e} from '@utils/logs';
import {badRequestErrorResponse, forbiddenErrorResponse, internalServerErrorResponse} from '@utils/errorUtils';
import MissionRepository from '@repositories/missionRepository';
import {MissionErrorCodes} from "@data/error/missionErrorCodes";

const missionRepository = new MissionRepository();

const updateMissionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tester = req.claims?.tester ?? false;
    const missionJson = req.body.mission;
    const { MISSION_ID: missionId } = JSON.parse(missionJson);
    const { USER_ID: userId } = req.body;

    if (!missionId || !userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const mission = await missionRepository.getMission(missionId);
        const missionManagers = await missionRepository.getMissionManagers(missionId);

        if (
            !mission ||
            !missionManagers
        ) {
            res.status(400).json(badRequestErrorResponse('Mission data not found'));
            return;
        }

        if (tester != mission.test || userId != req.uid) {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        const isManager = missionManagers.some(manager => manager.userId === userId);
        const isAdmin = req.claims?.admin ?? false;
        if (!isManager && !isAdmin)  {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        next();
    } catch (error: any) {
        e(new Error(`Error updating mission ${missionId}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
}

export default updateMissionMiddleware;