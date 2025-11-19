const { MissionParticipantField } = require('@fields/missionField');

const participantQuery = `
    DELETE FROM ${MissionParticipantField.TABLE_NAME}
    WHERE ${MissionParticipantField.MISSION_ID} = :mission_id
    AND ${MissionParticipantField.USER_ID} = :user_id
`;

const participantBinds = (missionId, userId) => ({
    mission_id: missionId,
    user_id: userId
});

module.exports = { participantQuery, participantBinds };