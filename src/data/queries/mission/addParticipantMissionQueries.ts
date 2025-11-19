import { MissionParticipantField } from '@fields/missionField';

export const insertParticipantQuery = `
    INSERT INTO ${MissionParticipantField.TABLE_NAME}(
        ${MissionParticipantField.MISSION_ID},
        ${MissionParticipantField.USER_ID}
    ) VALUES(
        :mission_id,
        :user_id
    )
`;

export const insertParticipantBinds = (missionId: string, userId: string) => ({
    mission_id: missionId,
    user_id: userId
});