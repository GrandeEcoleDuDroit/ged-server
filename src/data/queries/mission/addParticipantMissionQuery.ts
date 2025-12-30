import { MissionParticipantField } from '@fields/missionField';

export const query = `
    INSERT INTO ${MissionParticipantField.TABLE_NAME}(
        ${MissionParticipantField.MISSION_ID},
        ${MissionParticipantField.USER_ID}
    ) VALUES(
        :mission_id,
        :user_id
    )
`;

export const binds = (missionId: string, userId: string) => ({
    mission_id: missionId,
    user_id: userId
});