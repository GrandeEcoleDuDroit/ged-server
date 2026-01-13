import {MissionField} from '@fields/missionField';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
    mission_id: missionId}
);