import {MissionTaskField} from '@fields/missionField';

export const query = `
    SELECT JSON_OBJECT(*)
    FROM ${MissionTaskField.TABLE_NAME}
    WHERE ${MissionTaskField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
        mission_id: missionId}
);