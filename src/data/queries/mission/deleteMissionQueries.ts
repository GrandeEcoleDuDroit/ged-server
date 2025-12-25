import {MissionField, MissionManagerField, MissionTaskField} from '@fields/missionField';

export const deleteMissionQuery = `
    DELETE FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id 
      AND ${MissionField.MISSION_TEST} = :nmission_test
`;

export const deleteMissionBinds = (missionId: string, missionTest: boolean) => ({
    mission_id: missionId,
    mission_test: missionTest ? 1 : 0
});

export const deleteMissionManagerQuery = `
    DELETE FROM ${MissionManagerField.TABLE_NAME}
    WHERE ${MissionManagerField.MISSION_ID} = :mission_id
`;

export const deleteMissionManagerBinds = (missionId: string) => ({
    mission_id: missionId
});

export const deleteMissionTaskQuery = `
    DELETE FROM ${MissionTaskField.TABLE_NAME}
    WHERE ${MissionTaskField.MISSION_ID} = :mission_id
`;

export const deleteMissionTaskBinds = (missionId: string) => ({
    mission_id: missionId
});