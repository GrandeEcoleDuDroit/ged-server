const { oracleDatabaseConnection } = require('@config');

class MissionRepository {
    async createMission(mission, managers, participants, tasks) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            await this.#createMissionQuery(connection, mission);
            await this.#createMissionManagerQuery(connection, managers, mission.id);
            await this.#createMissionTaskQuery(connection, tasks, mission.id);
        } finally {
            if (connection) await connection.close();
        }
    }

    async #createMissionQuery(connection, mission) {
        const query = `
            MERGE INTO MISSIONS M
            USING(SELECT :mission_id AS MISSION_ID FROM dual) SOURCE
            ON (M.MISSION_ID = SOURCE.MISSION_ID)
            WHEN MATCHED THEN
                UPDATE SET
                    MISSION_TITLE = :mission_title,
                    MISSION_DESCRIPTION = :mission_description,
                    MISSION_SCHOOL_LEVEL_NUMBERS = :mission_school_level_numbers,
                    MISSION_DATE = :mission_date,
                    MISSION_START_DATE = :mission_start_date,
                    MISSION_END_DATE = :mission_end_date,
                    MISSION_FREQUENCY = :mission_frequency,
                    MISSION_PARTICIPANT_MAX = :mission_participant_max,
                    MISSION_IMAGE_FILE_NAME = :mission_image_file_name
            WHEN NOT MATCHED THEN 
                INSERT (
                    MISSION_ID,
                    MISSION_TITLE,
                    MISSION_DESCRIPTION,
                    MISSION_SCHOOL_LEVEL_NUMBERS,
                    MISSION_DATE,
                    MISSION_START_DATE,
                    MISSION_END_DATE,
                    MISSION_FREQUENCY,
                    MISSION_PARTICIPANT_MAX,
                    MISSION_IMAGE_FILE_NAME
                ) VALUES (
                    :mission_id,
                    :mission_title,
                    :mission_description,
                    :mission_school_level_numbers,
                    :mission_date,
                    :mission_start_date,
                    :mission_end_date,
                    :mission_frequency,
                    :mission_participant_max,
                    :mission_image_file_name
                )
        `;

        const binds = {
            mission_id: mission.id,
            mission_title: mission.title,
            mission_description: mission.description,
            mission_school_level_numbers: mission.schoolLevelNumbers,
            mission_date: mission.date,
            mission_start_date: mission.startDate,
            mission_end_date: mission.endDate,
            mission_frequency: mission.frequency,
            mission_participant_max: mission.participantMax,
            mission_image_file_name: mission.imageFileName
        };

        await connection.execute(query, binds, { autoCommit: true });
    }

    async #createMissionManagerQuery(connection, managers, missionId) {
        const query = `
            MERGE INTO MISSION_MANAGERS MM
            USING(SELECT :mission_id AS MISSION_ID, :manager_id AS USER_ID FROM dual) SOURCE
            ON (MM.MISSION_ID = SOURCE.MISSION_ID AND MM.USER_ID = SOURCE.USER_ID)
            WHEN NOT MATCHED THEN 
                INSERT (
                    MISSION_ID,
                    USER_ID
                ) VALUES (
                    :mission_id,
                    :manager_id
                ) 
        `;

        const bindsArray = managers.map(managerId => ({
            mission_id: missionId,
            manager_id: managerId
        }));

        await connection.executeMany(query, bindsArray, { autoCommit: true });
    }

    async #createMissionTaskQuery(connection, tasks, missionId) {
        if (!tasks || tasks.length === 0) return;

        const query = `
            MERGE INTO MISSION_TASKS MT
            USING(SELECT :mission_id AS MISSION_ID, :task_id AS TASK_ID FROM dual) SOURCE
            ON (MT.MISSION_ID = SOURCE.MISSION_ID AND MT.TASK_ID = SOURCE.TASK_ID)
            WHEN NOT MATCHED THEN 
                INSERT (
                    TASK_ID,
                    TASK_VALUE,
                    MISSION_ID
                ) VALUES (
                    :task_id,
                    :task_value,
                    :mission_id
                )
        `;

        const bindsArray = tasks.map(task => ({
            task_id: task.id,
            task_value: task.value,
            mission_id: missionId
        }));

        await connection.executeMany(query, bindsArray, { autoCommit: true });
    }
}

module.exports = MissionRepository;