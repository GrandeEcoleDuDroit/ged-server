import { MissionField } from '@fields/missionField';

export const deleteMissionQuery = `
    DELETE FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

export const deleteMissionBinds = (missionId: string) => ({
    mission_id: missionId
});