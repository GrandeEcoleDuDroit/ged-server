const OracleDatabaseManager = require("@data/oracleDatabaseManager");

class UserRepository {
    #oracleDatabaseManager = new OracleDatabaseManager();
    #oracleConnection;

    constructor() {
        this.#initializeConnection();
    }

    async #initializeConnection() {
        this.#oracleConnection = await this.#oracleDatabaseManager.getConnection();
    }

    async getUser(userId) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            SELECT JSON_OBJECT(*)
            FROM USERS
            WHERE USER_ID = :user_id
        `;

        const binds = {
            user_id: userId
        };

        const result = await this.#oracleConnection.execute(query, binds);
        return JSON.parse(result.rows[0]);
    }

    async getUserWithEmail(userEmail) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            SELECT JSON_OBJECT(*)
            FROM USERS
            WHERE USER_EMAIL = :user_email
        `;

        const binds = {
            user_email: userEmail
        };

        const result = await this.#oracleConnection.execute(query, binds);
        return JSON.parse(result.rows[0]);
    }

    async createUser(user) {
        if (!this.#oracleConnection) {
            throw new Error('Database connection not established');
        }

        const query = `
            MERGE INTO USERS U
            USING(SELECT :user_email AS USER_EMAIL FROM dual) SOURCE
            ON (U.USER_EMAIL = SOURCE.USER_EMAIL)
            WHEN MATCHED THEN
                UPDATE 
                    SET USER_ID = :user_id,
                        USER_FIRST_NAME = :user_first_name,
                        USER_LAST_NAME = :user_last_name,
                        USER_SCHOOL_LEVEL = :user_school_level,
                        USER_IS_MEMBER = :user_is_member
            WHEN NOT MATCHED THEN 
                INSERT(
                    USER_ID,
                    USER_FIRST_NAME,
                    USER_LAST_NAME,
                    USER_EMAIL,
                    USER_SCHOOL_LEVEL,
                    USER_IS_MEMBER
                )
                VALUES(
                    :user_id,
                    :user_first_name,
                    :user_last_name,
                    :user_email,
                    :user_school_level,
                    :user_is_member
                )
        `;

        const binds = {
            user_id: user.id,
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level: user.schoolLevel,
            user_is_member: user.isMember
        }

        return await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async updateProfilePictureFileName(profilePictureFileName, userId) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            UPDATE USERS
            SET USER_PROFILE_PICTURE_FILE_NAME = :user_profile_picture_file_name
            WHERE USER_ID = :user_id
        `;

        const binds = {
            user_profile_picture_file_name: profilePictureFileName,
            user_id: userId
        };

        await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async deleteProfilePictureFileName(userId) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            UPDATE USERS
            SET USER_PROFILE_PICTURE_FILE_NAME = NULL
            WHERE USER_ID = :user_id
        `;

        const binds = {
            user_id: userId
        };

        await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async checkUserWhiteList(userEmail) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            SELECT COUNT(*)
            FROM USERS_WHITELIST
            WHERE USER_EMAIL = :user_email
        `;

        const binds = {
            user_email: userEmail
        };

        const result = await this.#oracleConnection.execute(query, binds);
        return result.rows[0][0] > 0;
    }
}

module.exports = UserRepository;
