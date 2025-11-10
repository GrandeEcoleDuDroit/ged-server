const { MissionField, MissionManagerField, MissionTaskField } = require('@fields/missionField');

const missionQuery = `
    UPDATE ${MissionField.TABLE_NAME}
    SET 
        ${MissionField.MISSION_TITLE} = :mission_title,
        ${MissionField.MISSION_DESCRIPTION} = :mission_description,
        ${MissionField.MISSION_SCHOOL_LEVELS} = :mission_school_levels,
        ${MissionField.MISSION_START_DATE} = :mission_start_date,
        ${MissionField.MISSION_END_DATE} = :mission_end_date,
        ${MissionField.MISSION_DURATION} = :mission_duration,
        ${MissionField.MISSION_MAX_PARTICIPANTS} = :mission_max_participants,
        ${MissionField.MISSION_IMAGE_FILE_NAME} = :mission_image_file_name
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

const missionBinds = (mission) => ({
    mission_id: mission.id,
    mission_title: mission.title,
    mission_description: mission.description,
    mission_school_levels: mission.schoolLevels,
    mission_start_date: mission.startDate,
    mission_end_date: mission.endDate,
    mission_duration: mission.duration,
    mission_max_participants: mission.maxParticipants,
    mission_image_file_name: mission.imageFileName
});

const deleteMissionManagerQuery = `
    DELETE FROM ${MissionManagerField.TABLE_NAME}
    WHERE ${MissionManagerField.MISSION_ID} = :mission_id
`;

const deleteMissionManagerBinds = (missionId) => ({
    mission_id: missionId
});

const addMissionManagerQuery = `
    INSERT INTO ${MissionManagerField.TABLE_NAME}(
        ${MissionManagerField.MISSION_ID},
        ${MissionManagerField.USER_ID}
    ) VALUES(
        :mission_id,
        :user_id
    )
`;

const addMissionManagerBinds = (missionId, managerIds) => managerIds.map(managerId => ({
    mission_id: missionId,
    user_id: managerId
}));


const deleteMissionTaskQuery = `
    DELETE FROM ${MissionTaskField.TABLE_NAME}
    WHERE ${MissionTaskField.MISSION_ID} = :mission_id
`;

const deleteMissionTaskBinds = (missionId) => ({
    mission_id: missionId
});

const addMissionTaskQuery = `
    INSERT INTO ${MissionTaskField.TABLE_NAME}(
        ${MissionTaskField.MISSION_TASK_ID},
        ${MissionTaskField.MISSION_TASK_VALUE},
        ${MissionTaskField.MISSION_ID}
    ) VALUES(
        :mission_task_id,
        :mission_task_value,
        :mission_id
    )
`;

const addMissionTaskBinds = (missionId, tasks) => tasks.map(task => ({
    mission_task_id: task.id,
    mission_task_value: task.value,
    mission_id: missionId
}));

module.exports = {
    missionQuery,
    missionBinds,
    deleteMissionManagerQuery,
    deleteMissionManagerBinds,
    addMissionManagerQuery,
    addMissionManagerBinds,
    deleteMissionTaskQuery,
    deleteMissionTaskBinds,
    addMissionTaskQuery,
    addMissionTaskBinds
};