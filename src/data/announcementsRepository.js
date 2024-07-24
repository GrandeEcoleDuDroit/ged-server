const OracleDatabaseManager = require('./oracleDatabaseManager');

class AnnouncementsRepository {
    #oracleDatabaseManager = new OracleDatabaseManager();
    #oracleConnection;

    constructor() {
        this.#initializeConnection();
    }

    async #initializeConnection() {
        this.#oracleConnection = await this.#oracleDatabaseManager.getConnection();
    }

    async getAllAnnouncements() {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ANNOUNCEMENTS 
            NATURAL JOIN USERS
        `;

        const resultRequest = await this.#oracleConnection.execute(query);
        return resultRequest.rows.map(row => JSON.parse(row[0]));
    }
}

module.exports = AnnouncementsRepository;