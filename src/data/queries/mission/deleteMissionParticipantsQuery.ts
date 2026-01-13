import { MissionParticipantField } from '@fields/missionField';

export const query = `
    DELETE FROM ${MissionParticipantField.TABLE_NAME}
    WHERE ${MissionParticipantField.MISSION_ID} = :mission_id
    AND ${MissionParticipantField.USER_ID} = :user_id
`;

export const binds = (missionId: string, userIds: string[]) => userIds.map(userId => ({
    mission_id: missionId,
    user_id: userId
}));