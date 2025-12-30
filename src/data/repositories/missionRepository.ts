import OracleApi from '@api/oracleApi';
import { sendMail } from '@api/googleApi';
import {toMission} from '@data/mappers/missionMapper';
import type {Result} from 'oracledb';
import type {Mission, MissionTask, MissionReport, OracleMission} from '@models/mission';
import * as getMissionsQuery from '@queries/mission/getMissionsQuery';
import * as getMissionQuery from '@queries/mission/getMissionQuery';
import * as getMissionParticipantCountQuery from '@queries/mission/getMissionParticipantCountQuery';
import * as createMissionQuery from '@queries/mission/createMissionQuery';
import * as updateMissionQuery from '@queries/mission/updateMissionQuery';
import * as deleteMissionQuery from '@queries/mission/deleteMissionQuery';
import * as addParticipantMissionQuery from '@queries/mission/addParticipantMissionQuery';
import * as removeParticipantQuery from '@queries/mission/removeParticipantQuery';

const oracleApi = OracleApi.instance;

export default class MissionRepository {
    async getMissions(missionTest: boolean) {
        const result = await oracleApi.execute(
            getMissionsQuery.query,
            getMissionsQuery.binds(missionTest)
        );
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as Mission
        ) ?? [];
    }

    async getMission(missionId: string) {
        const result = await oracleApi.execute(
            getMissionQuery.query,
            getMissionQuery.binds(missionId)
        ) as Result<string[]>;
        const missionJson = result.rows?.[0]?.[0];
        return missionJson ? toMission(JSON.parse(missionJson) as OracleMission) : null;
    }

    async getMissionParticipantCount(missionId: string) {
        const result = await oracleApi.execute(
            getMissionParticipantCountQuery.query,
            getMissionParticipantCountQuery.binds(missionId)
        ) as Result<number[]>;
        return result.rows?.[0]?.[0] ?? 0;
    }

    async createMission(mission: Mission, managerIds: string[], tasks: MissionTask[]) {
        await oracleApi.execute(
            createMissionQuery.insertMissionQuery,
            createMissionQuery.insertMissionBinds(mission),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            createMissionQuery.insertMissionManagerQuery,
            createMissionQuery.insertMissionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                createMissionQuery.insertMissionTaskQuery,
                createMissionQuery.insertMissionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async updateMission(mission: Mission, managerIds: string[], tasks: MissionTask[]) {
        const updateMissionResult = await oracleApi.execute(
            updateMissionQuery.updateMissionQuery,
            updateMissionQuery.updateMissionBinds(mission),
            { autoCommit: true }
        );

        if (updateMissionResult.rowsAffected == 0) {
            throw new Error('Mission not found');
        }

        await oracleApi.execute(
            updateMissionQuery.deleteMissionManagerQuery,
            updateMissionQuery.deleteMissionManagerBinds(mission.id),
            { autoCommit: true }
        );

        await oracleApi.executeMany(
            updateMissionQuery.insertMissionManagerQuery,
            updateMissionQuery.insertMissionManagerBinds(mission.id, managerIds),
            { autoCommit: true }
        );

        await oracleApi.execute(
            updateMissionQuery.deleteMissionTaskQuery,
            updateMissionQuery.deleteMissionTaskBinds(mission.id),
            { autoCommit: true }
        );

        if (tasks.length > 0) {
            await oracleApi.executeMany(
                updateMissionQuery.insertMissionTaskQuery,
                updateMissionQuery.insertMissionTaskBinds(mission.id, tasks),
                { autoCommit: true }
            );
        }
    }

    async deleteMission(missionId: string, missionTest: boolean) {
        const deleteMissionResult = await oracleApi.execute(
            deleteMissionQuery.deleteMissionQuery,
            deleteMissionQuery.deleteMissionBinds(missionId, missionTest),
            { autoCommit: true }
        );

        if (deleteMissionResult.rowsAffected == 0) {
            throw new Error('Mission not found');
        }

        await oracleApi.execute(
            deleteMissionQuery.deleteMissionManagerQuery,
            deleteMissionQuery.deleteMissionManagerBinds(missionId),
            { autoCommit: true }
        );

        await oracleApi.execute(
            deleteMissionQuery.deleteMissionTaskQuery,
            deleteMissionQuery.deleteMissionTaskBinds(missionId),
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
            addParticipantMissionQuery.query,
            addParticipantMissionQuery.binds(missionId, userId),
            { autoCommit: true }
        );
    }

    async removeParticipant(missionId: string, userId: string) {
        await oracleApi.execute(
            removeParticipantQuery.query,
            removeParticipantQuery.binds(missionId, userId),
            { autoCommit: true }
        );
    }
}
