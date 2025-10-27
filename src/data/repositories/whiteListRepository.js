const oracleApi = require('@api/oracleApi');
const { TABLE_NAME, WhiteListFields } = require('@fields/whiteListFields')

class WhiteListRepository {
    async checkUserWhiteList(userEmail) {
        const query = `
            SELECT COUNT(*) 
            FROM ${TABLE_NAME} 
            WHERE ${WhiteListFields.USER_EMAIL} = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds);

        return result.rows[0][0] > 0;
    }
}

module.exports = new WhiteListRepository();
