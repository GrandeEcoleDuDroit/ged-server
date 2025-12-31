import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import type {Mission, MissionTask, MissionReport} from '@models/mission';
import MissionRepository from '@repositories/missionRepository';
import ImageRepository from '@repositories/imageRepository';
import {formatOracleError, invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import {Readable} from 'stream';
import type {ServerResponse} from '@models/serverResponse';

const missionRepository = new MissionRepository();
const imageRepository = new ImageRepository();

export const getMissions = async (req: Request, res: Response) => {
    const missionTest = req.claims?.tester ?? false;

    try {
        const result = await missionRepository.getMissions(missionTest);
        res.json(result);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error getting missions',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const createMission = async (req: Request, res: Response) => {
    const missionTest = req.claims?.tester ?? false;
    const missionJson = req.body.mission;
    const imageFile = req.file;
    const {
        MISSION_ID: id,
        MISSION_TITLE: title,
        MISSION_DESCRIPTION: description,
        MISSION_SCHOOL_LEVELS: schoolLevels,
        MISSION_DATE: date,
        MISSION_START_DATE: startDate,
        MISSION_END_DATE: endDate,
        MISSION_DURATION: duration,
        MISSION_MANAGER_IDS: managerIds,
        MISSION_MAX_PARTICIPANTS: maxParticipants,
        MISSION_TASKS: tasks,
        MISSION_IMAGE_FILE_NAME: imageFileName
    } = JSON.parse(missionJson);

    if(
        !id ||
        !title ||
        !description ||
        !schoolLevels ||
        !date ||
        !startDate ||
        !endDate ||
        !managerIds ||
        !maxParticipants
    ) {
        const serverResponse: ServerResponse = {
            message: 'Error creating mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const mission: Mission = {
            id: id,
            title: title,
            description: description,
            schoolLevels: schoolLevels,
            date: date,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            maxParticipants: maxParticipants,
            imageFileName: imageFileName,
            test: missionTest
        };
        const missionTasks: MissionTask[] = JSON.parse(tasks).map((task: any) => ({
            id: task.MISSION_TASK_ID,
            value: task.MISSION_TASK_VALUE
        }));
        const missionManagerIds: string[] = JSON.parse(managerIds);

        await missionRepository.createMission(mission, missionManagerIds, missionTasks);
        if (imageFile) {
            await imageRepository.uploadImage(
                Readable.from(imageFile.buffer),
                getImagePath(imageFile.originalname),
                imageFile.size
            );
        }

        const serverResponse: ServerResponse = { message: `Mission has been created successfully` };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error creating mission', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const updateMission = async (req: Request, res: Response) => {
    const missionTest = req.claims?.tester ?? false;
    const missionJson = req.body.mission;
    const imageFile = req.file;
    const {
        MISSION_ID: id,
        MISSION_TITLE: title,
        MISSION_DESCRIPTION: description,
        MISSION_SCHOOL_LEVELS: schoolLevels,
        MISSION_DATE: date,
        MISSION_START_DATE: startDate,
        MISSION_END_DATE: endDate,
        MISSION_DURATION: duration,
        MISSION_MANAGER_IDS: managerIds,
        MISSION_MAX_PARTICIPANTS: maxParticipants,
        MISSION_TASKS: tasks,
        MISSION_IMAGE_FILE_NAME: imageFileName
    } = JSON.parse(missionJson);

    if(
        !id ||
        !title ||
        !description ||
        !schoolLevels ||
        !startDate ||
        !endDate ||
        !managerIds ||
        !maxParticipants
    ) {
        const serverResponse: ServerResponse = {
            message: 'Error updating mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    const mission: Mission = {
        id: id,
        title: title,
        description: description,
        schoolLevels: schoolLevels,
        date: date,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        maxParticipants: maxParticipants,
        imageFileName: imageFileName,
        test: missionTest
    };
    let previousMission: Mission | null = null;

    try {
        previousMission = await missionRepository.getMission(mission.id)
        const missionTasks: MissionTask[] = JSON.parse(tasks).map((task: any) => ({
            id: task.MISSION_TASK_ID,
            value: task.MISSION_TASK_VALUE
        }));
        const missionManagerIds: string[] = JSON.parse(managerIds);

        await missionRepository.updateMission(mission, missionManagerIds, missionTasks);
        if (imageFile) {
            await imageRepository.uploadImage(
                Readable.from(imageFile.buffer),
                getImagePath(imageFile.originalname),
                imageFile.size
            );
        }

        const serverResponse: ServerResponse = { message: 'Mission has been updated successfully'};
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error updating mission', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
        return;
    }

    try {
        const previousImageFileName = previousMission?.imageFileName;
        if (previousImageFileName && previousImageFileName != mission.imageFileName) {
            await imageRepository.deleteImage(getImagePath(previousImageFileName));
        }
    } catch (error: any) {
        e(`Error deleting previous mission image: ${mission.id}`, error);
    }
}

export const deleteMission = async (req: Request, res: Response) => {
    const missionTest = req.claims?.tester ?? false;
    const {
        MISSION_ID: missionId,
        MISSION_IMAGE_FILE_NAME: imageFileName
    } = req.body;

    if(!missionId) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await missionRepository.deleteMission(missionId, missionTest);
        const serverResponse: ServerResponse = { message: 'Mission has been deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error deleting mission', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
        return;
    }

    if (imageFileName) {
        try {
            await imageRepository.deleteImage(getImagePath(imageFileName));
        } catch (error: any) {
            e(`Error deleting mission image: ${missionId}`, error);
        }
    }
}

export const reportMission = async (req: Request, res: Response) => {
    const {
        missionId: missionId,
        reporter: reporter,
        reason: reason
    } = req.body;

    if(!missionId || !reporter || !reason) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    const report: MissionReport = {
        missionId: missionId,
        reporter: reporter,
        reason: reason
    };

    try {
        await missionRepository.reportMission(report);
        const serverResponse: ServerResponse = { message: 'Mission has been reported successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const addParticipant = async (req: Request, res: Response) => {
    const {
        MISSION_ID: missionId,
        USER_ID: userId
    } = req.body;

    if(!missionId || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error adding participant to mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await missionRepository.addParticipant(missionId, userId);
        const serverResponse: ServerResponse = { message: 'Participant has been added to mission successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error adding participant to mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const removeParticipant = async (req: Request, res: Response) => {
    const {
        MISSION_ID: missionId,
        USER_ID: userId
    } = req.body;

    if(!missionId || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error removing participant from mission',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await missionRepository.removeParticipant(missionId, userId);
        const serverResponse: ServerResponse = { message: 'Participant has been removed from mission successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error removing participant from mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

function getImagePath(fileName: string): string {
    const imageFolder = 'MissionImages';
    return `${imageFolder}/${fileName}`;
}