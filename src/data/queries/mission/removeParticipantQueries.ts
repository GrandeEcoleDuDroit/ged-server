import { MissionParticipantField } from '@fields/missionField';

export const deleteParticipantQuery = `
    DELETE FROM ${MissionParticipantField.TABLE_NAME}
    WHERE ${MissionParticipantField.MISSION_ID} = :mission_id
    AND ${MissionParticipantField.USER_ID} = :user_id
`;

export const deleteParticipantBinds = (missionId: string, userId: string) => ({
    mission_id: missionId,
    user_id: userId
});