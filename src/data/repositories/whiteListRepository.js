const OracleDatabaseConnection = require('@config/oracleDatabaseConnection');
oracleDatabaseConnection = new OracleDatabaseConnection();

class WhiteListRepository {
    #oracleConnection;

    constructor() {
        this.#initializeConnection()
    }

    async #initializeConnection() {
        this.#oracleConnection = await oracleDatabaseConnection.getConnection();
    }

    async checkUserWhiteList(userEmail) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            SELECT COUNT(*)
            FROM USERS_WHITE_LIST
            WHERE USER_EMAIL = :user_email
        `;

        const binds = {
            user_email: userEmail
        };

        const result = await this.#oracleConnection.execute(query, binds);
        return result.rows[0][0] > 0;
    }
}

module.exports = WhiteListRepository;