import type {NextFunction, Request, Response} from 'express';
import {e} from '@utils/logs';
import {badRequestErrorResponse, forbiddenErrorResponse, internalServerErrorResponse} from '@utils/errorUtils';
import MissionRepository from '@repositories/missionRepository';
import {MissionErrorCodes} from "@data/error/missionErrorCodes";

const missionRepository = new MissionRepository();

const addParticipantMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const missionTest = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        USER_ID: userId,
        USER_SCHOOL_LEVEL: userSchoolLevel
    } = req.body;

    if (
        !missionId ||
        !userId ||
        !userSchoolLevel
    ) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        const mission = await missionRepository.getMission(missionId, missionTest);
        const missionParticipants = await missionRepository.getMissionParticipants(missionId)

        if (!mission) {
            res.status(400).json(badRequestErrorResponse('Mission not found'));
            return;
        }

        if (missionTest != mission.test || userId != req.uid) {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        const schoolLevels = JSON.parse(mission.schoolLevels) as number[];
        if (!schoolLevels.includes(parseInt(userSchoolLevel)))  {
            res.status(400).json(badRequestErrorResponse('User school level not allowed for this mission', MissionErrorCodes.SCHOOL_LEVEL_NOT_ALLOWED));
            return;
        }

        if (missionParticipants.length >= mission.maxParticipants) {
            res.status(400).json(badRequestErrorResponse('Mission is full', MissionErrorCodes.MAX_PARTICIPANTS_NUMBER_REACHED));
            return
        }

        next();
    } catch (error: any) {
        e(new Error(`Error adding participant to mission ${missionId}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
}

export default addParticipantMiddleware;