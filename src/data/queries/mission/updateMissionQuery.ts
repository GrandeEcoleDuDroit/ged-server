import { MissionField, MissionManagerField, MissionTaskField } from '@fields/missionField';
import type { Mission, MissionTask } from '@models/mission';

export const updateMissionQuery = `
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
    AND ${MissionField.MISSION_TEST} = :mission_test
`;

export const updateMissionBinds = (mission: Mission) => ({
    mission_id: mission.id,
    mission_title: mission.title,
    mission_description: mission.description,
    mission_school_levels: mission.schoolLevels,
    mission_start_date: mission.startDate,
    mission_end_date: mission.endDate,
    mission_duration: mission.duration,
    mission_max_participants: mission.maxParticipants,
    mission_image_file_name: mission.imageFileName,
    mission_test: mission.test ? 1 : 0
});

export const deleteMissionManagerQuery = `
    DELETE FROM ${MissionManagerField.TABLE_NAME}
    WHERE ${MissionManagerField.MISSION_ID} = :mission_id
`;

export const deleteMissionManagerBinds = (missionId: string) => ({
    mission_id: missionId
});

export const insertMissionManagerQuery = `
    INSERT INTO ${MissionManagerField.TABLE_NAME}(
        ${MissionManagerField.MISSION_ID},
        ${MissionManagerField.USER_ID}
    ) VALUES(
        :mission_id,
        :user_id
    )
`;

export const insertMissionManagerBinds = (missionId: string, managerIds: string[]) => managerIds.map(managerId => ({
    mission_id: missionId,
    user_id: managerId
}));


export const deleteMissionTaskQuery = `
    DELETE FROM ${MissionTaskField.TABLE_NAME}
    WHERE ${MissionTaskField.MISSION_ID} = :mission_id
`;

export const deleteMissionTaskBinds = (missionId: string) => ({
    mission_id: missionId
});

export const insertMissionTaskQuery = `
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

export const insertMissionTaskBinds = (missionId: string, tasks: MissionTask[]) => tasks.map(task => ({
    mission_task_id: task.id,
    mission_task_value: task.value,
    mission_id: missionId
}));