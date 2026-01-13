import {MissionParticipantField} from '@fields/missionField';

export const query = `
    SELECT JSON_OBJECT(*) 
    FROM ${MissionParticipantField.TABLE_NAME}
    WHERE ${MissionParticipantField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
    mission_id: missionId
});