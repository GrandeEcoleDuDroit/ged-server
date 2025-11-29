import {MissionField, MissionManagerField, MissionTaskField} from '@fields/missionField';

export const deleteMissionQuery = `
    DELETE FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

export const deleteMissionBinds = (missionId: string) => ({
    mission_id: missionId
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