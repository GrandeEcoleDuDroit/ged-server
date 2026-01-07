import OracleApi from '@api/oracleApi';
import { sendMail } from '@api/googleApi';
import {toMission, toMissionManager, toMissionParticipant, toMissionTask} from '@data/mappers/missionMapper';
import type {Result} from 'oracledb';
import type {
    Mission,
    MissionTask,
    MissionReport,
    OracleMission,
    OracleMissionTask,
    OracleMissionParticipant, OracleMissionManager, InboundOracleMission
} from '@models/mission';
import * as getMissionsQuery from '@queries/mission/getMissionsQuery';
import * as getMissionQuery from '@queries/mission/getMissionQuery';
import * as getMissionManagersQuery from '@queries/mission/getMissionManagersQuery';
import * as getMissionParticipantsQuery from '@queries/mission/getMissionParticipantsQuery';
import * as getMissionParticipantUsersQuery from '@queries/mission/getMissionParticipantUsersQuery';
import * as getMissionTasksQuery from '@queries/mission/getMissionTasksQuery';
import * as createMissionQuery from '@queries/mission/createMissionQuery';
import * as addParticipantMissionQuery from '@queries/mission/addParticipantMissionQuery';
import * as updateMissionQuery from '@queries/mission/updateMissionQuery';
import * as deleteMissionQuery from '@queries/mission/deleteMissionQuery';
import * as deleteMissionParticipantsQuery from '@queries/mission/deleteMissionParticipantsQuery';
import * as deleteMissionParticipantQuery from '@queries/mission/deleteMissionParticipantQuery';
import type {OracleUser} from "@models/user";
import {toUser} from "@data/mappers/userMapper";

const oracleApi = OracleApi.instance;

export default class MissionRepository {
    async getMissions(missionTest: boolean) {
        const result = await oracleApi.execute(
            getMissionsQuery.missionQuery,
            getMissionsQuery.binds(missionTest)
        );

        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as InboundOracleMission
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

    async getMissionManagers(missionId: string) {
        const result = await oracleApi.execute(
            getMissionManagersQuery.query,
            getMissionManagersQuery.binds(missionId)
        );

        return result.rows?.map(
            row => {
                const oracleMissionManager = JSON.parse(row as [string][0]) as OracleMissionManager
                return toMissionManager(oracleMissionManager)
            }
        ) ?? [];
    }

    async getMissionParticipants(missionId: string) {
        const result = await oracleApi.execute(
            getMissionParticipantsQuery.query,
            getMissionParticipantsQuery.binds(missionId)
        );

        return result.rows?.map(
            row => {
                const oracleMissionParticipant = JSON.parse(row as [string][0]) as OracleMissionParticipant
                return toMissionParticipant(oracleMissionParticipant)
            }
        ) ?? [];
    }

    async getMissionParticipantUsers(missionId: string) {
        const result = await oracleApi.execute(
            getMissionParticipantUsersQuery.query,
            getMissionParticipantUsersQuery.binds(missionId)
        );

        return result.rows?.map(
            row => {
                const oracleUser = JSON.parse(row as [string][0]) as OracleUser
                return toUser(oracleUser)
            }
        ) ?? [];
    }

    async getMissionTasks(missionId: string) {
        const result = await oracleApi.execute(
            getMissionTasksQuery.query,
            getMissionTasksQuery.binds(missionId)
        );

        return result.rows?.map(
            row => {
                const oracleMissionTask = JSON.parse(row as [string][0]) as OracleMissionTask
                return toMissionTask(oracleMissionTask)
            }
        ) ?? [];
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

    async updateMission(
        mission: Mission,
        managerIdsToDelete: string[],
        managerIdsToAdd: string[],
        missionTasksToDelete: MissionTask[],
        missionTasksToAdd: MissionTask[],
        participantIdsToDelete: string[],
    ) {
        let connection;

        try {
            connection = await oracleApi.getConnection();

            const updateMissionResult = await connection.execute(
                updateMissionQuery.updateMissionQuery,
                updateMissionQuery.updateMissionBinds(mission)
            );

            if (updateMissionResult.rowsAffected == 0) {
                throw new Error('Mission not found');
            }

            if (managerIdsToDelete.length > 0) {
                await connection.executeMany(
                    updateMissionQuery.deleteManagersQuery,
                    updateMissionQuery.deleteManagersBinds(mission.id, managerIdsToDelete)
                );
            }

            if (managerIdsToAdd.length > 0) {
                await connection.executeMany(
                    updateMissionQuery.insertManagersQuery,
                    updateMissionQuery.insertMissionManagersBinds(mission.id, managerIdsToAdd)
                );
            }

            if (missionTasksToDelete.length > 0) {
                await connection.executeMany(
                    updateMissionQuery.deleteMissionTasksQuery,
                    updateMissionQuery.deleteMissionTasksBinds(mission.id, missionTasksToDelete)
                );
            }

            if (missionTasksToAdd.length > 0) {
                await connection.executeMany(
                    updateMissionQuery.insertMissionTasksQuery,
                    updateMissionQuery.insertMissionTasksBinds(mission.id, missionTasksToAdd)
                );
            }

            if (participantIdsToDelete.length > 0) {
                await connection.executeMany(
                    deleteMissionParticipantsQuery.query,
                    deleteMissionParticipantsQuery.binds(mission.id, participantIdsToDelete)
                )
            }

            await connection.commit();
        } catch (error) {
            throw error;
        } finally {
            await connection?.close();
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

    async addMissionParticipant(missionId: string, userId: string) {
        await oracleApi.execute(
            addParticipantMissionQuery.query,
            addParticipantMissionQuery.binds(missionId, userId),
            { autoCommit: true }
        );
    }

    async deleteMissionParticipant(missionId: string, userId: string) {
        await oracleApi.execute(
            deleteMissionParticipantQuery.query,
            deleteMissionParticipantQuery.binds(missionId, userId),
            { autoCommit: true }
        );
    }
}
