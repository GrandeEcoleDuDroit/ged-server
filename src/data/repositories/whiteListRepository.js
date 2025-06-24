const OracleDatabaseConnection = require('@config/oracleDatabaseConnection');
const oracleDatabaseConnection = new OracleDatabaseConnection();

class WhiteListRepository {

    async checkUserWhiteList(userEmail) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();

            const query = `
                SELECT COUNT(*) FROM USERS_WHITE_LIST WHERE USER_EMAIL = :user_email
            `;

            const binds = { user_email: userEmail };
            const result = await connection.execute(query, binds);

            return result.rows[0][0] > 0;
        } finally {
            if (connection) await connection.close(); // Rend au pool
        }
    }
}

module.exports = WhiteListRepository;
