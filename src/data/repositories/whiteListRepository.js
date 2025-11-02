const oracleApi = require('@api/oracleApi');
const WhiteListFields = require('@fields/whiteListField')

class WhiteListRepository {
    async checkUserWhiteList(userEmail) {
        return true;
        const query = `
            SELECT COUNT(*) 
            FROM ${WhiteListFields.TABLE_NAME} 
            WHERE ${WhiteListFields.USER_EMAIL} = :user_email
        `;

        const binds = { user_email: userEmail };
        const result = await oracleApi.execute(query, binds);

        return result.rows[0][0] > 0;
    }
}

module.exports = new WhiteListRepository();
