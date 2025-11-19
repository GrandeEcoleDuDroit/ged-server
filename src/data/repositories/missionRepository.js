const oracleApi = require('@api/oracleApi');
const getMissionQueries = require('@queries/mission/getMissionQueries');
const createMissionQuery = require('@queries/mission/createMissionQueries');
const updateMissionQueries = require('@queries/mission/updateMissionQueries');
const deleteMissionQueries = require('@queries/mission/deleteMissionQueries');
const addParticipantMissionQueries = require('@queries/mission/addParticipantMissionQueries');
const removeParticipantQueries = require('@queries/mission/removeParticipantQueries');
const { sendMail } = require('@api/googleApi');

class MissionRepository {
    async getMissions() {
        const result = await oracleApi.execute(getMissionQueries.getMissionsQuery);
        return result.rows.map(row => JSON.parse(row[0]));
    }

    async createMission(mission, managerIds, tasks) {
        await oracleApi.execute(
            createMissionQuery.missionQuery,
            createMissionQuery.missionBinds(mission),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            createMissionQuery.missionManagerQuery,
            createMissionQuery.missionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                createMissionQuery.missionTaskQuery,
                createMissionQuery.missionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async updateMission(mission, managerIds, tasks) {
        await oracleApi.execute(
            updateMissionQueries.missionQuery,
            updateMissionQueries.missionBinds(mission),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionManagerQuery,
            updateMissionQueries.deleteMissionManagerBinds(mission.id),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            updateMissionQueries.addMissionManagerQuery,
            updateMissionQueries.addMissionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionTaskQuery,
            updateMissionQueries.deleteMissionTaskBinds(mission.id),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                updateMissionQueries.addMissionTaskQuery,
                updateMissionQueries.addMissionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async deleteMission(missionId) {
        await oracleApi.execute(
            deleteMissionQueries.missionQuery,
            deleteMissionQueries.missionBinds(missionId),
            { autoCommit: true }
        );
    }

    async reportMission(report) {
        const subject = `Mission report: ${report.missionId}`;
        const html = `
           <p>The mission ${report.missionId} has been reported</p>
           <p>Reported by : ${report.userInfo.fullName} - <b>${report.userInfo.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }

    async addParticipant(missionId, userId) {
        await oracleApi.execute(
            addParticipantMissionQueries.participantQuery,
            addParticipantMissionQueries.participantBinds(missionId, userId),
            { autoCommit: true }
        );
    }

    async removeParticipant(missionId, userId) {
        await oracleApi.execute(
            removeParticipantQueries.participantQuery,
            removeParticipantQueries.participantBinds(missionId, userId),
            { autoCommit: true }
        );
    }
}

module.exports = new MissionRepository();