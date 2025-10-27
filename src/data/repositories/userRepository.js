const oracleApi = require('@api/oracleApi');
const { sendMail } = require('@api/googleApi');
const { TABLE_NAME, UserFields } = require('@fields/userFields');

class UserRepository {
    async getUser(userId) {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${TABLE_NAME}
            WHERE ${UserFields.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        const result = await oracleApi.execute(query, binds);
        return JSON.parse(result.rows[0][0]);
    }

    async getUserWithEmail(userEmail) {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${TABLE_NAME}
            WHERE ${UserFields.USER_EMAIL} = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds);
        return JSON.parse(result.rows[0][0]);
    }

    async createUser(user) {
        const query = `
            MERGE INTO ${TABLE_NAME} U
            USING(SELECT :user_email AS ${UserFields.USER_EMAIL} FROM dual) SOURCE
            ON (U.${UserFields.USER_EMAIL} = SOURCE.${UserFields.USER_EMAIL})
            WHEN MATCHED THEN
                UPDATE SET
                    ${UserFields.USER_ID} = :user_id,
                    ${UserFields.USER_FIRST_NAME} = :user_first_name,
                    ${UserFields.USER_LAST_NAME} = :user_last_name,
                    ${UserFields.USER_SCHOOL_LEVEL_ID} = :user_school_level_id,
                    ${UserFields.USER_IS_ADMIN} = :user_is_admin
            WHEN NOT MATCHED THEN 
                INSERT (
                    ${UserFields.USER_ID},
                    ${UserFields.USER_FIRST_NAME},
                    ${UserFields.USER_LAST_NAME},
                    ${UserFields.USER_EMAIL},
                    ${UserFields.USER_SCHOOL_LEVEL_ID},
                    ${UserFields.USER_IS_ADMIN}
                ) VALUES (
                    :user_id,
                    :user_first_name,
                    :user_last_name,
                    :user_email,
                    :user_school_level_id,
                    :user_is_admin
                )
        `;

        const binds = {
            user_id: user.id,
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level_id: user.schoolLevelId,
            user_is_admin: user.isAdmin
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateUser(user) {
        const query = `
            UPDATE ${TABLE_NAME}
            SET ${UserFields.USER_FIRST_NAME} = :user_first_name,
                ${UserFields.USER_LAST_NAME} = :user_last_name,
                ${UserFields.USER_EMAIL} = :user_email,
                ${UserFields.USER_SCHOOL_LEVEL_ID} = :user_school_level_id,
                ${UserFields.USER_IS_ADMIN} = :user_is_admin,
                ${UserFields.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name,
                ${UserFields.USER_IS_DELETED} = :user_is_deleted
            WHERE ${UserFields.USER_ID} = :user_id
        `;

        const binds = {
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level_id: user.schoolLevelId,
            user_is_admin: user.isAdmin,
            user_profile_picture_file_name: user.profilePictureFileName,
            user_is_deleted: user.isDeleted,
            user_id: user.id
        };

        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateProfilePictureFileName(profilePictureFileName, userId) {
        const query = `
            UPDATE ${TABLE_NAME}
            SET ${UserFields.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name
            WHERE ${UserFields.USER_ID} = :user_id
        `;

        const binds = {
            user_profile_picture_file_name: profilePictureFileName,
            user_id: userId
        };

        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteUser(userId) {
        const query = `
            DELETE FROM ${TABLE_NAME}
            WHERE ${UserFields.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteProfilePictureFileName(userId) {
        const query = `
            UPDATE ${TABLE_NAME}
            SET ${UserFields.USER_PROFILE_PICTURE_FILE_NAME} = NULL
            WHERE ${UserFields.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async reportUser(report) {
        const subject = `Report User ${report.userId}`;
        const html = `
           <p>The user ${report.userId} has been reported</p>
           <p>User : ${report.userInfo.fullName} - <b>${report.userInfo.email}</b></p>
           <p>Reporter : ${report.reporterInfo.fullName} - <b>${report.reporterInfo.email}</b></p>
           <p>Reason : ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}

module.exports = new UserRepository();
