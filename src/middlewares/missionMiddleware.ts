import { Request, Response, NextFunction } from 'express';
import { e } from '@utils/logs';

export const addParticipantMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const tester = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        MISSION_PARTICIPANTS_NUMBER: participantsNumber,
        MISSION_MAX_PARTICIPANTS: maxParticipants,
        MISSION_TEST: missionTest,
        USER_ID: userId,
        USER_SCHOOL_LEVEL: userSchoolLevel
    } = req.body;
    let { MISSION_SCHOOL_LEVELS: schoolLevels } = req.body;

    schoolLevels = schoolLevels || [];

    if (
        !missionId ||
        !missionTest ||
        maxParticipants === null ||
        participantsNumber === null ||
        !userId ||
        !userSchoolLevel
    ) {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error: `
            Some missing fields :
            {
                missionId: ${missionId},
                maxParticipants: ${maxParticipants},
                participantsNumber: ${participantsNumber},
                userId: ${userId},
                userSchoolLevel: ${userSchoolLevel}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (tester != missionTest) {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error : 'You are not authorized to perform this action.'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (schoolLevels.length > 0 && !schoolLevels.includes(userSchoolLevel))  {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error : "User school level not allowed for this mission"
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (participantsNumber >= maxParticipants) {
        const serverResponse = {
            message: 'Error adding participant to mission',
            error : "Mission is full"
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    next();
}

export const removeParticipantMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const tester = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        MISSION_TEST: missionTest,
        USER_ID: userId
    } = req.body;

    if (
        !missionId ||
        !missionTest ||
        !userId
    ) {
        const serverResponse = {
            message: "Error removing participant from mission",
            error: `
            Some missing fields :
            {
                missionId: ${missionId},
                userId: ${userId}
            }
            `
        }

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (tester != missionTest) {
        const serverResponse = {
            message: 'Error removing participant from mission',
            error : 'You are not authorized to perform this action.'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    if (userId == req.uid || req.claims?.admin == true) {
        next();
    } else {
        const serverResponse = {
            message: 'You are not authorized to perform this action.',
            error : 'Error removing participant'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }
}