const oracleApi = require('@api/oracleApi');
const { MissionField, MissionManagerField, MissionTaskField } = require('@fields/missionField');

class MissionRepository {
    async createMission(mission, managerIds, tasks) {
        const missionQuery = `
            INSERT INTO ${MissionField.TABLE_NAME}(
                ${MissionField.MISSION_ID},
                ${MissionField.MISSION_TITLE},
                ${MissionField.MISSION_DESCRIPTION},
                ${MissionField.MISSION_SCHOOL_LEVELS},
                ${MissionField.MISSION_DATE},
                ${MissionField.MISSION_START_DATE},
                ${MissionField.MISSION_END_DATE},
                ${MissionField.MISSION_DURATION},
                ${MissionField.MISSION_MAX_PARTICIPANTS},
                ${MissionField.MISSION_IMAGE_FILE_NAME}
            ) VALUES(
                :mission_id,
                :mission_title,
                :mission_description,
                :mission_school_levels,
                :mission_date,
                :mission_start_date,
                :mission_end_date,
                :mission_duration,
                :mission_max_participants,
                :mission_image_file_name
            )
        `;

        const missionBinds = {
            mission_id: mission.id,
            mission_title: mission.title,
            mission_description: mission.description,
            mission_school_levels: mission.schoolLevels,
            mission_date: mission.date,
            mission_start_date: mission.startDate,
            mission_end_date: mission.endDate,
            mission_duration: mission.duration,
            mission_max_participants: mission.maxParticipants,
            mission_image_file_name: mission.imageFileName
        };

        const missionManagerQuery = `
            INSERT INTO ${MissionManagerField.TABLE_NAME}(
                ${MissionManagerField.MISSION_ID},
                ${MissionManagerField.USER_ID}
            ) VALUES(
                :mission_id, 
                :user_id
            )
        `;

        const missionManagerBinds = managerIds.map(managerId => ({
            mission_id: mission.id,
            user_id: managerId
        }));

        const missionTaskQuery = `
            INSERT INTO ${MissionTaskField.TABLE_NAME}(
                ${MissionTaskField.MISSION_TASK_ID},
                ${MissionTaskField.MISSION_TASK_VALUE},
                ${MissionTaskField.MISSION_ID}
            ) VALUES(
                :mission_task_id,
                :mission_task_value,
                :mission_id
            )
        `;

        const missionTaskBinds = tasks.map(task => ({
            mission_task_id: task.id,
            mission_task_value: task.value,
            mission_id: mission.id
        }));

        await oracleApi.execute(missionQuery, missionBinds, { autoCommit: true });
        await oracleApi.executeMany(missionManagerQuery, missionManagerBinds, { autoCommit: true });
        if (tasks.length > 0) {
            await oracleApi.executeMany(missionTaskQuery, missionTaskBinds, {autoCommit: true});
        }
    }
    async updateMission(mission, managerIds, tasks) {
        const missionQuery = `
            UPDATE ${MissionField.TABLE_NAME}
            SET 
                ${MissionField.MISSION_TITLE} = :mission_title,
                ${MissionField.MISSION_DESCRIPTION} = :mission_description,
                ${MissionField.MISSION_SCHOOL_LEVELS} = :mission_school_levels,
                ${MissionField.MISSION_START_DATE} = :mission_start_date,
                ${MissionField.MISSION_END_DATE} = :mission_end_date,
                ${MissionField.MISSION_DURATION} = :mission_duration,
                ${MissionField.MISSION_MAX_PARTICIPANTS} = :mission_max_participants,
                ${MissionField.MISSION_IMAGE_FILE_NAME} = :mission_image_file_name
            WHERE ${MissionField.MISSION_ID} = :mission_id
        `;

        const missionBinds = {
            mission_id: mission.id,
            mission_title: mission.title,
            mission_description: mission.description,
            mission_school_levels: mission.schoolLevels,
            mission_start_date: mission.startDate,
            mission_end_date: mission.endDate,
            mission_duration: mission.duration,
            mission_max_participants: mission.maxParticipants,
            mission_image_file_name: mission.imageFileName
        };

        const deleteMissionManagerQuery = `
            DELETE FROM ${MissionManagerField.TABLE_NAME}
            WHERE ${MissionManagerField.MISSION_ID} = :mission_id
        `;

        const deleteMissionManagerBinds = {
            mission_id: mission.id
        };

        const addMissionManagerQuery = `
            INSERT INTO ${MissionManagerField.TABLE_NAME}(
                ${MissionManagerField.MISSION_ID},
                ${MissionManagerField.USER_ID}
            ) VALUES(
                :mission_id, 
                :user_id
            )
        `;

        const addMissionManagerBinds = managerIds.map(managerId => ({
            mission_id: mission.id,
            user_id: managerId
        }));

        const deleteMissionTaskQuery = `
            DELETE FROM ${MissionTaskField.TABLE_NAME}
            WHERE ${MissionTaskField.MISSION_ID} = :mission_id
        `;

        const deleteMissionTaskBinds = {
            mission_id: mission.id
        };

        const addMissionTaskQuery = `
            INSERT INTO ${MissionTaskField.TABLE_NAME}(
                ${MissionTaskField.MISSION_TASK_ID},
                ${MissionTaskField.MISSION_TASK_VALUE},
                ${MissionTaskField.MISSION_ID}
            ) VALUES(
                :mission_task_id,
                :mission_task_value,
                :mission_id
            )
        `;

        const addMissionTaskBinds = tasks.map(task => ({
            mission_task_id: task.id,
            mission_task_value: task.value,
            mission_id: mission.id
        }));

        await oracleApi.execute(missionQuery, missionBinds, { autoCommit: true });
        await oracleApi.execute(deleteMissionManagerQuery, deleteMissionManagerBinds, { autoCommit: true });
        await oracleApi.executeMany(addMissionManagerQuery, addMissionManagerBinds, { autoCommit: true });
        await oracleApi.execute(deleteMissionTaskQuery, deleteMissionTaskBinds, { autoCommit: true });
        if (tasks.length > 0) {
            await oracleApi.executeMany(addMissionTaskQuery, addMissionTaskBinds, { autoCommit: true });
        }
    }
}

module.exports = new MissionRepository();