const OracleDatabaseManager = require('./oracleDatabaseManager');

class AnnouncementsRepository {
    #oracleDatabaseManager = new OracleDatabaseManager();
    #oracleConnection

    constructor() {
        this.#oracleConnection = this.#oracleDatabaseManager.getConnection();
    }

    async getAllAnnouncements(response) {
        try {
            if (!this.#oracleConnection) {
                return response.status(500).json({ error: 'Database connection not established' });
            }
            const query = `
                SELECT JSON_OBJECT(*) 
                FROM announcements 
                NATURAL JOIN users
            `
            const resultRequest = await this.#oracleConnection.execute(query);
            const announcements = resultRequest.rows.map(row => JSON.parse(row[0]));
            console.log('Result of query: ', announcements);
            response.json(announcements);
        }
        catch (err) {
            console.error('Error executing query:', err);
            response.status(500).json({ error: 'Failed to execute query' });
        }
    }
}

module.exports = AnnouncementsRepository;