import { Request, Response } from 'express';
import { e } from '@utils/logs';
import type { Mission, MissionTask, MissionReport } from '@models/mission';
import MissionRepository from '@repositories/missionRepository';
import ImageRepository from '@repositories/imageRepository';
import { formatOracleError } from '@utils/exceptionUtils';
import {Readable} from "stream";

const missionRepository = new MissionRepository();
const imageRepository = new ImageRepository();

export const getMissions = async (_: Request, res: Response) => {
    try {
        const result = await missionRepository.getMissions();
        res.json(result);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error to get missions',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const createMission = async (req: Request, res: Response) => {
    const missionJson = req.body.mission;
    const imagePath = req.body.imagePath;
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
        !date ||
        !startDate ||
        !endDate ||
        !managerIds ||
        !maxParticipants
    ) {
        const serverResponse = {
            message: "Error to create mission",
            error: `
            Some missing mission fields : 
            {
                id: ${id},
                title: ${title},
                description: ${description},
                date: ${date},
                startDate: ${startDate},
                endDate: ${endDate},
                managerIds: ${managerIds},
                maxParticipants: ${maxParticipants},
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const mission: Mission = {
            id: id,
            title: title,
            description: description,
            schoolLevels: schoolLevels || '[]',
            date: date,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            maxParticipants: maxParticipants,
            imageFileName: imageFileName
        };
        const missionTasks: MissionTask[] = JSON.parse(tasks).map((task: any) => ({
            id: task.MISSION_TASK_ID,
            value: task.MISSION_TASK_VALUE
        }));
        const missionManagerIds: string[] = JSON.parse(managerIds);

        await missionRepository.createMission(mission, missionManagerIds, missionTasks);
        if (imageFile && imagePath) {
            await imageRepository.uploadImage(
                Readable.from(imageFile.buffer),
                imagePath,
                imageFile.size
            );
        }

        const serverResponse = {
            message: `Mission created successfully`
        };

        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error creating mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const updateMission = async (req: Request, res: Response) => {
    const missionJson = req.body.mission;
    const imagePath = req.body.imagePath;
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
        !startDate ||
        !endDate ||
        !managerIds ||
        !maxParticipants
    ) {
        const serverResponse = {
            message: "Error to update mission",
            error: `
            Some missing mission fields : 
            {
                id: ${id},
                title: ${title},
                description: ${description},
                startDate: ${startDate},
                endDate: ${endDate},
                managerIds: ${managerIds},
                maxParticipants: ${maxParticipants},
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const mission: Mission = {
            id: id,
            title: title,
            description: description,
            schoolLevels: schoolLevels || '[]',
            date: date,
            startDate: startDate,
            endDate: endDate,
            duration: duration,
            maxParticipants: maxParticipants,
            imageFileName: imageFileName
        };
        const missionTasks: MissionTask[] = JSON.parse(tasks).map((task: any) => ({
            id: task.MISSION_TASK_ID,
            value: task.MISSION_TASK_VALUE
        }));
        const missionManagerIds: string[] = JSON.parse(managerIds);

        await missionRepository.updateMission(mission, missionManagerIds, missionTasks);
        if (imageFile && imagePath) {
            await imageRepository.uploadImage(
                Readable.from(imageFile.buffer),
                imagePath,
                imageFile.size
            );
        }

        const serverResponse = {
            message: `Mission updated successfully`
        };

        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error updating mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const deleteMission = async (req: Request, res: Response) => {
    const missionId = req.body.MISSION_ID;
    const imagePath = req.body.imagePath;

    if(!missionId) {
        const serverResponse = {
            message: "Error to delete mission",
            error: `
            Some missing mission fields : 
            {
                missionId: ${missionId},
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await missionRepository.deleteMission(missionId);
        if (imagePath) {
            try {
                await imageRepository.deleteImage(imagePath);
            } catch (imageError) {
                console.error(`Failed to delete image: ${imagePath}`, imageError);
            }
        }
        const serverResponse = {
            message: `Mission ${missionId} deleted successfully`
        };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error delete mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const reportMission = async (req: Request, res: Response) => {
    const {
        missionId: missionId,
        reporter: reporter,
        reason: reason
    } = req.body;

    if(!missionId || !reporter || !reason) {
        const serverResponse = {
            message: "Error to report announcement",
            error: `
            Some missing report fields :
            {
                missionId: ${missionId},
                reporter: ${reporter},
                reason: ${reason},
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const report: MissionReport = {
        missionId: missionId,
        reporter: reporter,
        reason: reason
    };

    try {
        await missionRepository.reportMission(report);
        const serverResponse = {
            message: `Mission ${missionId} reported successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
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

    try {
        await missionRepository.addParticipant(missionId, userId);
        const serverResponse = {
            message: `Participant has been added successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
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

    try {
        await missionRepository.removeParticipant(missionId, userId);
        const serverResponse = {
            message: `Participant has been removed successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: 'Error removing participant from mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}