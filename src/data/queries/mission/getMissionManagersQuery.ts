import {MissionManagerField} from '@fields/missionField';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${MissionManagerField.TABLE_NAME}
    WHERE ${MissionManagerField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
        mission_id: missionId}
);