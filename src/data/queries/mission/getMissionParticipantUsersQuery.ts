import {MissionParticipantField} from '@fields/missionField';
import {UserField} from "@fields/userField";

export const query = `
    SELECT JSON_OBJECT(U.*) 
    FROM ${MissionParticipantField.TABLE_NAME} MP
    INNER JOIN ${UserField.TABLE_NAME} U ON MP.USER_ID = U.USER_ID
    WHERE MP.${MissionParticipantField.MISSION_ID} = :mission_id
`;

export const binds = (missionId: string) => ({
    mission_id: missionId
});