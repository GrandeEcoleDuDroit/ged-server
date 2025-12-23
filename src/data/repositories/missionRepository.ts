import OracleApi from '@api/oracleApi';
import { sendMail } from '@api/googleApi';
import * as getMissionQueries from '@queries/mission/getMissionQueries';
import * as createMissionQueries from '@queries/mission/createMissionQueries';
import * as updateMissionQueries from '@queries/mission/updateMissionQueries';
import * as deleteMissionQueries from '@queries/mission/deleteMissionQueries';
import * as addParticipantMissionQueries from '@queries/mission/addParticipantMissionQueries';
import * as removeParticipantQueries from '@queries/mission/removeParticipantQueries';
import type { Mission, MissionTask, MissionReport } from "@models/mission";

const oracleApi = OracleApi.instance;

export default class MissionRepository {
    async getMissions() {
        const result = await oracleApi.execute(getMissionQueries.getMissionsQuery);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as Mission
        ) ?? [];
    }

    async createMission(mission: Mission, managerIds: string[], tasks: MissionTask[]) {
        await oracleApi.execute(
            createMissionQueries.insertMissionQuery,
            createMissionQueries.insertMissionBinds(mission),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            createMissionQueries.insertMissionManagerQuery,
            createMissionQueries.insertMissionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                createMissionQueries.insertMissionTaskQuery,
                createMissionQueries.insertMissionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async updateMission(mission: Mission, managerIds: string[], tasks: MissionTask[]) {
        await oracleApi.execute(
            updateMissionQueries.updateMissionQuery,
            updateMissionQueries.updateMissionBinds(mission),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionManagerQuery,
            updateMissionQueries.deleteMissionManagerBinds(mission.id),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            updateMissionQueries.insertMissionManagerQuery,
            updateMissionQueries.insertMissionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionTaskQuery,
            updateMissionQueries.deleteMissionTaskBinds(mission.id),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                updateMissionQueries.insertMissionTaskQuery,
                updateMissionQueries.insertMissionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async deleteMission(missionId: string) {
        await oracleApi.execute(
            deleteMissionQueries.deleteMissionQuery,
            deleteMissionQueries.deleteMissionBinds(missionId),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionManagerQuery,
            updateMissionQueries.deleteMissionManagerBinds(missionId),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQueries.deleteMissionTaskQuery,
            updateMissionQueries.deleteMissionTaskBinds(missionId),
            { autoCommit: true }
        );
    }

    async reportMission(report: MissionReport) {
        const subject = `Mission report: ${report.missionId}`;
        const html = `
           <p>The mission ${report.missionId} has been reported</p>
           <p>Reported by: ${report.reporter.fullName} - <b>${report.reporter.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }

    async addParticipant(missionId: string, userId: string) {
        await oracleApi.execute(
            addParticipantMissionQueries.insertParticipantQuery,
            addParticipantMissionQueries.insertParticipantBinds(missionId, userId),
            { autoCommit: true }
        );
    }

    async removeParticipant(missionId: string, userId: string) {
        await oracleApi.execute(
            removeParticipantQueries.deleteParticipantQuery,
            removeParticipantQueries.deleteParticipantBinds(missionId, userId),
            { autoCommit: true }
        );
    }
}
