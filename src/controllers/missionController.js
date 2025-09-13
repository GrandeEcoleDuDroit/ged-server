const { e } = require('@utils/logs');
const Mission = require('@models/mission');
const MissionRepository = require('@repositories/missionRepository');
const formatOracleError = require('@utils/exceptionUtils')

const missionRepository = new MissionRepository();

const createMission = async (req, res) => {
    try {
        let mission = JSON.parse(req.body.mission);
        const {
            MISSION_ID: id,
            MISSION_TITLE: title,
            MISSION_DESCRIPTION: description,
            MISSION_SCHOOL_LEVEL_NUMBERS: schoolLevelNumbers,
            MISSION_DATE: date,
            MISSION_START_DATE: startDate,
            MISSION_END_DATE: endDate,
            MISSION_FREQUENCY: frequency,
            MISSION_MANAGERS: managers,
            MISSION_PARTICIPANTS: participants,
            MISSION_PARTICIPANT_MAX: participantMax,
            MISSION_TASKS: tasks,
            MISSION_IMAGE_FILE_NAME: imageFileName
        } = mission;
        const imageFile = req.file;

        if (!id || !title || !description || !schoolLevelNumbers || !date || !startDate || !endDate || !frequency || !participantMax || !tasks) {
            const serverResponse = {
                message: 'Error creating mission',
                error: `
              All mission fields are required :
              {
                id: ${id},
                title: ${title},
                description: ${description},
                schoolLevelNumbers: ${schoolLevelNumbers},
                date: ${date},
                startDate: ${startDate},
                endDate: ${endDate},
                frequency: ${frequency},
                managers: ${managers},
                participants: ${participants},
                participantMax: ${participantMax},
                tasks: ${tasks}
              }`
            };

            e(serverResponse.message, new Error(serverResponse.error));
            return res.status(400).json(serverResponse);
        }

        mission = new Mission(
            id,
            title,
            description,
            schoolLevelNumbers,
            date,
            startDate,
            endDate,
            frequency,
            participantMax,
            imageFileName
        );

        const missionManagers = JSON.parse(managers);
        const missionParticipants = JSON.parse(participants);
        const missionTasks = JSON.parse(tasks);

        await missionRepository.createMission(mission, missionManagers, missionParticipants, missionTasks);
        res.status(201).json({message: 'Mission created successfully'});
    } catch (error) {
        const serverResponse = formatOracleError(error, 'Error creating mission');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    createMission
};