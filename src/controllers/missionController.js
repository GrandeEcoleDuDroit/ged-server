const { e } = require('@utils/logs');
const Mission = require('@models/mission');
const MissionTask = require('@models/missionTask');
const MissionReport = require('@models/missionReport');
const missionRepository = require("@repositories/missionRepository");
const imageRepository = require("@repositories/imageRepository");
const formatOracleError = require("@utils/exceptionUtils")

const getMissions = async (req, res) => {
    try {
        const result = await missionRepository.getMissions();
        res.json(result);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error to get missions',
            error : error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const createMission = async (req, res) => {
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
        const mission = new Mission(
            id,
            title,
            description,
            schoolLevels || '[]',
            date,
            startDate,
            endDate,
            duration,
            managerIds,
            '[]',
            maxParticipants,
            tasks || '[]',
            imageFileName || null
        );
        const missionTasks = JSON.parse(tasks).map(task =>
            new MissionTask(
                task.MISSION_TASK_ID,
                task.MISSION_TASK_VALUE
            )
        );
        const missionManagerIds = JSON.parse(managerIds);
        await missionRepository.createMission(mission, missionManagerIds, missionTasks);
        if (imageFile) {
            await imageRepository.uploadImage(imageFile.path, imageFile.originalname);
        }

        const serverResponse = {
            message: `Mission created successfully`
        };

        res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = formatOracleError(error, 'Error creating mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const updateMission = async (req, res) => {
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
        const mission = new Mission(
            id,
            title,
            description,
            schoolLevels || '[]',
            date,
            startDate,
            endDate,
            duration,
            managerIds,
            '[]',
            maxParticipants,
            tasks || '[]',
            imageFileName || null
        );
        const missionTasks = JSON.parse(tasks).map(task =>
            new MissionTask(
                task.MISSION_TASK_ID,
                task.MISSION_TASK_VALUE
            )
        );
        const missionManagerIds = JSON.parse(managerIds);
        await missionRepository.updateMission(mission, missionManagerIds, missionTasks);
        if (imageFile) {
            await imageRepository.uploadImage(imageFile.path, imageFile.originalname);
        }

        const serverResponse = {
            message: `Mission updated successfully`
        };

        res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = formatOracleError(error, 'Error updating mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const deleteMission = async (req, res) => {
    const missionId = req.body.missionId;
    const missionImageFileName = req.body.imageFileName;

    try {
        await missionRepository.deleteMission(missionId);
        if (missionImageFileName) {
            try {
                await imageRepository.deleteImage(missionImageFileName);
            } catch (imageError) {
                console.error(`Erreur lors de la suppression de l'image: ${missionImageFileName}`, imageError);
            }
        }
        const serverResponse = {
            message: `Mission ${missionId} deleted successfully`
        };
        res.status(200).json(serverResponse);
    } catch (error) {
        const serverResponse = formatOracleError(error, 'Error delete mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const reportMission = async (req, res) => {
    const {
        missionId: missionId,
        userInfo: userInfo,
        reason: reason
    } = req.body;

    if(!missionId || !userInfo || !reason) {
        const serverResponse = {
            message: "Error to report announcement",
            error: `
            Some missing report fields :
            {
                missionId: ${missionId},
                userInfo: ${userInfo},
                reason: ${reason},
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const report = new MissionReport(missionId, userInfo, reason);

    try {
        await missionRepository.reportMission(report);
        const serverResponse = {
            message: `Mission ${missionId} reported successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error reporting mission',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    getMissions,
    createMission,
    updateMission,
    deleteMission,
    reportMission
}