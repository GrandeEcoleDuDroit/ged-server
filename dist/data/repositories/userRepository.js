import { OracleDatabaseConnection } from '../../config/oracleDatabaseConnection.ts';
const oracleDatabaseConnection = OracleDatabaseConnection.getInstance();
export class UserRepository {
    async getUser(userId) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `SELECT JSON_OBJECT(*) FROM USERS WHERE USER_ID = :user_id`;
            const binds = { user_id: userId };
            const result = await connection.execute(query, binds);
            const rows = result.rows;
            const jsonString = rows?.[0]?.[0];
            if (!jsonString)
                return null;
            return JSON.parse(jsonString);
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async getUserWithEmail(userEmail) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `SELECT JSON_OBJECT(*) FROM USERS WHERE USER_EMAIL = :user_email`;
            const binds = { user_email: userEmail };
            const result = await connection.execute(query, binds);
            const rows = result.rows;
            const jsonString = rows?.[0]?.[0];
            if (!jsonString)
                return null;
            return JSON.parse(jsonString);
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async createUser(user) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `
                MERGE INTO USERS U
                USING(SELECT :user_email AS USER_EMAIL FROM dual) SOURCE
                ON (U.USER_EMAIL = SOURCE.USER_EMAIL)
                WHEN MATCHED THEN
                    UPDATE SET
                        USER_ID = :user_id,
                        USER_FIRST_NAME = :user_first_name,
                        USER_LAST_NAME = :user_last_name,
                        USER_SCHOOL_LEVEL = :user_school_level,
                        USER_IS_MEMBER = :user_is_member
                WHEN NOT MATCHED THEN 
                    INSERT (
                        USER_ID,
                        USER_FIRST_NAME,
                        USER_LAST_NAME,
                        USER_EMAIL,
                        USER_SCHOOL_LEVEL,
                        USER_IS_MEMBER
                    ) VALUES (
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
            };
            return await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async updateProfilePictureFileName(profilePictureFileName, userId) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `
                UPDATE USERS
                SET USER_PROFILE_PICTURE_FILE_NAME = :user_profile_picture_file_name
                WHERE USER_ID = :user_id
            `;
            const binds = {
                user_profile_picture_file_name: profilePictureFileName,
                user_id: userId
            };
            await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async deleteProfilePictureFileName(userId) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `
                UPDATE USERS
                SET USER_PROFILE_PICTURE_FILE_NAME = NULL
                WHERE USER_ID = :user_id
            `;
            const binds = { user_id: userId };
            await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
}
