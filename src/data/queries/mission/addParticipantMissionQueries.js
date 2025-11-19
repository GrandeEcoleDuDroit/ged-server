const { MissionParticipantField } = require('@fields/missionField');

const participantQuery = `
    INSERT INTO ${MissionParticipantField.TABLE_NAME}(
        ${MissionParticipantField.MISSION_ID},
        ${MissionParticipantField.USER_ID}
    ) VALUES(
        :mission_id,
        :user_id
    )
`;

const participantBinds = (missionId, userId) => ({
    mission_id: missionId,
    user_id: userId
});

module.exports = { participantQuery, participantBinds };