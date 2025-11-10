const { MissionField } = require('@fields/missionField');

const missionQuery = `
    DELETE FROM ${MissionField.TABLE_NAME}
    WHERE ${MissionField.MISSION_ID} = :mission_id
`;

const missionBinds = (missionId) => ({
    mission_id: missionId
});

module.exports = {
    missionQuery,
    missionBinds
};