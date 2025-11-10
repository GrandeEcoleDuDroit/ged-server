const oracleApi = require('@api/oracleApi');
const { sendMail } = require('@api/googleApi');
const UserField = require('@fields/userField');

class UserRepository {
    async getUser(userId) {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${UserField.TABLE_NAME}
            WHERE ${UserField.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        const result = await oracleApi.execute(query, binds);
        return JSON.parse(result.rows[0][0]);
    }

    async getUserWithEmail(userEmail) {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${UserField.TABLE_NAME}
            WHERE ${UserField.USER_EMAIL} = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds);
        return JSON.parse(result.rows[0][0]);
    }

    async createUser(user) {
        const query = `
            MERGE INTO ${UserField.TABLE_NAME} U
            USING(SELECT :user_email AS ${UserField.USER_EMAIL} FROM dual) SOURCE
            ON (U.${UserField.USER_EMAIL} = SOURCE.${UserField.USER_EMAIL})
            WHEN MATCHED THEN
                UPDATE SET
                    ${UserField.USER_ID} = :user_id,
                    ${UserField.USER_FIRST_NAME} = :user_first_name,
                    ${UserField.USER_LAST_NAME} = :user_last_name,
                    ${UserField.USER_SCHOOL_LEVEL} = :user_school_level,
                    ${UserField.USER_STATE} = :user_state
            WHEN NOT MATCHED THEN 
                INSERT (
                    ${UserField.USER_ID},
                    ${UserField.USER_FIRST_NAME},
                    ${UserField.USER_LAST_NAME},
                    ${UserField.USER_EMAIL},
                    ${UserField.USER_SCHOOL_LEVEL},
                    ${UserField.USER_STATE}
                ) VALUES (
                    :user_id,
                    :user_first_name,
                    :user_last_name,
                    :user_email,
                    :user_school_level,
                    :user_state
                )
        `;

        const binds = {
            user_id: user.id,
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level: user.schoolLevel,
            user_state: user.state
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateUser(user) {
        const query = `
            UPDATE ${UserField.TABLE_NAME}
            SET ${UserField.USER_FIRST_NAME} = :user_first_name,
                ${UserField.USER_LAST_NAME} = :user_last_name,
                ${UserField.USER_EMAIL} = :user_email,
                ${UserField.USER_SCHOOL_LEVEL} = :user_school_level,
                ${UserField.USER_ADMIN} = :user_admin,
                ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name,
                ${UserField.USER_STATE} = :user_state,
                ${UserField.USER_TESTER} = :user_tester
            WHERE ${UserField.USER_ID} = :user_id
        `;

        const binds = {
            user_first_name: user.firstName,
            user_last_name: user.lastName,
            user_email: user.email,
            user_school_level: user.schoolLevel,
            user_admin: user.admin,
            user_profile_picture_file_name: user.profilePictureFileName,
            user_state: user.state,
            user_tester: user.tester,
            user_id: user.id
        };

        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateProfilePictureFileName(profilePictureFileName, userId) {
        const query = `
            UPDATE ${UserField.TABLE_NAME}
            SET ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = :user_profile_picture_file_name
            WHERE ${UserField.USER_ID} = :user_id
        `;

        const binds = {
            user_profile_picture_file_name: profilePictureFileName,
            user_id: userId
        };

        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteUser(userId) {
        const query = `
            DELETE FROM ${UserField.TABLE_NAME}
            WHERE ${UserField.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteProfilePictureFileName(userId) {
        const query = `
            UPDATE ${UserField.TABLE_NAME}
            SET ${UserField.USER_PROFILE_PICTURE_FILE_NAME} = NULL
            WHERE ${UserField.USER_ID} = :user_id
        `;

        const binds = { user_id: userId };
        await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async reportUser(report) {
        const subject = `User report: ${report.userId}`;
        const html = `
           <p>The user ${report.userId} has been reported</p>
           <p>User : ${report.userInfo.fullName} - <b>${report.userInfo.email}</b></p>
           <p>Reporter : ${report.reporterInfo.fullName} - <b>${report.reporterInfo.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}

module.exports = new UserRepository();
