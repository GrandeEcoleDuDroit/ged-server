const { e } = require('@utils/logs');
const Mission = require('@models/mission');
const missionRepository = require("@repositories/missionRepository");
const imageRepository = require("@repositories/imageRepository");
const formatOracleError = require("@utils/exceptionUtils")

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
            tasks,
            imageFileName || null
        );
        const missionTasks = JSON.parse(tasks || '[]');
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
            message: "Error to create mission",
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
            tasks,
            imageFileName || null
        );
        const missionTasks = JSON.parse(tasks || '[]');
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

module.exports = {
    createMission,
    updateMission
}