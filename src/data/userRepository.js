const oracledb = require('oracledb');
const OracleDatabaseManager = require("./oracleDatabaseManager");

class UserRepository {
    #oracleDatabaseManager = new OracleDatabaseManager();
    #oracleConnection;

    constructor() {
        this.#initializeConnection();
    }

    async #initializeConnection() {
        this.#oracleConnection = await this.#oracleDatabaseManager.getConnection();
    }

    async createUser(user) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }
        const query = `
            INSERT INTO USERS(
                USER_FIRST_NAME,
                USER_LAST_NAME,
                USER_EMAIL,
                USER_SCHOOL_LEVEL,
                USER_IS_MEMBER
            )
            VALUES(
                :user_first_name,
                :user_last_name,
                :user_email,
                :user_school_level,
                :user_is_member
            )
            RETURNING USER_ID INTO :user_id
        `;

        const binds = {
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level: user.schoolLevel,
            user_is_member: user.isMember,
            user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        }

        return await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async updateProfilePictureUrl(profilePictureUrl, userId) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            UPDATE USERS
            SET USER_PROFILE_PICTURE_URL = :user_profile_picture_url
            WHERE USER_ID = :user_id
        `;

        const binds = {
            user_profile_picture_url: profilePictureUrl,
            user_id: userId
        };

        await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async deleteProfilePictureUrl(userId) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            DELETE FROM USERS
            WHERE USER_ID = :user_id
        `;

        const binds = {
            user_id: userId
        };

        await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }
}

module.exports = UserRepository;
