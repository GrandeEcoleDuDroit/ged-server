import type {NextFunction, Request, Response} from 'express';
import type {ServerResponse} from '@models/serverResponse';
import {e} from '@utils/logs';
import {invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import MissionRepository from '@repositories/missionRepository';

const missionRepository = new MissionRepository();

const removeParticipantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const tester = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        USER_ID: userId
    } = req.body;

    if (!missionId || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error removing participant from mission',
            error: 'Missing fields'
        }

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return
    }

    try {
        const mission = await missionRepository.getMission(missionId);

        if (!mission) {
            const serverResponse: ServerResponse = {
                message: 'Error removing participant from mission',
                error: 'Mission not found'
            };

            e(serverResponse.message, new Error(`Mission not found: ${missionId}`));
            res.status(400).json(serverResponse);
            return
        }

        if (
            tester != mission.test ||
            (req.claims?.admin != true && userId != req.uid)
        ) {
            const serverResponse: ServerResponse = {
                message: 'Error removing participant from mission',
                error: 'You are not authorized to perform this action.'
            };

            const fields = req.body;
            fields.tokenId = req.uid;
            fields.admin = req.claims?.admin;
            fields.fetchedMission = mission;
            e(serverResponse.message, new Error(invalidFieldsErrorMessage('Invalid fields', fields)));
            res.status(400).json(serverResponse);
            return;
        }

        next();
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error removing participant from mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export default removeParticipantMiddleware;