import { MissionField, MissionManagerField, MissionTaskField } from '@fields/missionField';
import type { Mission, MissionTask } from '@models/mission';

export const insertMissionQuery = `
    INSERT INTO ${MissionField.TABLE_NAME}(
        ${MissionField.MISSION_ID},
        ${MissionField.MISSION_TITLE},
        ${MissionField.MISSION_DESCRIPTION},
        ${MissionField.MISSION_SCHOOL_LEVELS},
        ${MissionField.MISSION_DATE},
        ${MissionField.MISSION_START_DATE},
        ${MissionField.MISSION_END_DATE},
        ${MissionField.MISSION_DURATION},
        ${MissionField.MISSION_MAX_PARTICIPANTS},
        ${MissionField.MISSION_IMAGE_FILE_NAME},
        ${MissionField.MISSION_TEST}
    ) VALUES(
        :mission_id,
        :mission_title,
        :mission_description,
        :mission_school_levels,
        :mission_date,
        :mission_start_date,
        :mission_end_date,
        :mission_duration,
        :mission_max_participants,
        :mission_image_file_name,
        :mission_test
    )
`;

export const insertMissionBinds = (mission: Mission) => ({
    mission_id: mission.id,
    mission_title: mission.title,
    mission_description: mission.description,
    mission_school_levels: mission.schoolLevels,
    mission_date: mission.date,
    mission_start_date: mission.startDate,
    mission_end_date: mission.endDate,
    mission_duration: mission.duration,
    mission_max_participants: mission.maxParticipants,
    mission_image_file_name: mission.imageFileName,
    mission_test: mission.test ? 1 : 0
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