const oracleApi = require('@api/oracleApi');

class WhiteListRepository {

    async checkUserWhiteList(userEmail) {
        const query = `
            SELECT COUNT(*) FROM USERS_WHITE_LIST WHERE USER_EMAIL = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds);

        return result.rows[0][0] > 0;
    }
}

module.exports = WhiteListRepository;
