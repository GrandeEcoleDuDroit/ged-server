import type {NextFunction, Request, Response} from 'express';
import type {ServerResponse} from '@models/serverResponse';
import {e} from '@utils/logs';
import {invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import MissionRepository from '@repositories/missionRepository';

const missionRepository = new MissionRepository();

const addParticipantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const tester = req.claims?.tester ?? false;
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
        const serverResponse: ServerResponse = {
            message: 'Error adding participant to mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return
    }

    try {
        const mission = await missionRepository.getMission(missionId);
        const participantCount = await missionRepository.getMissionParticipantCount(missionId)

        if (!mission) {
            const serverResponse: ServerResponse = {
                message: 'Error adding participant to mission',
                error: 'Mission not found'
            };

            e(serverResponse.message, new Error(`Mission not found: ${missionId}`));
            res.status(400).json(serverResponse);
            return
        }

        if (tester != mission.test || userId != req.uid) {
            const serverResponse: ServerResponse = {
                message: 'Error adding participant to mission',
                error : 'You are not authorized to perform this action.'
            };

            const fields = req.body;
            fields.fetchedMission = mission;
            fields.tokenId = req.uid;
            e(serverResponse.message, new Error(invalidFieldsErrorMessage('Invalid fields', fields)));
            res.status(400).json(serverResponse);
            return
        }

        const schoolLevels = JSON.parse(mission.schoolLevels) as string[];
        if (schoolLevels.length > 0 && !schoolLevels.includes(userSchoolLevel))  {
            const serverResponse: ServerResponse = {
                message: 'Error adding participant to mission',
                error : 'User school level not allowed for this mission'
            };

            e(serverResponse.message, new Error(serverResponse.error));
            res.status(400).json(serverResponse);
            return
        }

        if (participantCount >= mission.maxParticipants) {
            const serverResponse: ServerResponse = {
                message: 'Error adding participant to mission',
                error : 'Mission is full'
            };

            e(serverResponse.message, new Error(serverResponse.error));
            res.status(400).json(serverResponse);
            return
        }

        next();
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error adding participant to mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export default addParticipantMiddleware;