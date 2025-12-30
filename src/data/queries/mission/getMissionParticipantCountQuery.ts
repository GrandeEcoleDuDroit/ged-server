import {MissionParticipantField} from '@fields/missionField';

export const query = `
    SELECT COUNT(*) 
    FROM ${MissionParticipantField.TABLE_NAME}
    WHERE ${MissionParticipantField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
    mission_id: missionId
});