const OracleDatabaseManager = require('@data/oracleDatabaseManager');

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

        const result = await this.#oracleConnection.execute(query);
        return result.rows.map(row => JSON.parse(row[0]));
    }

    async createAnnouncement(announcement) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            INSERT INTO ANNOUNCEMENTS(
                ANNOUNCEMENT_ID,
                ANNOUNCEMENT_TITLE,
                ANNOUNCEMENT_CONTENT,
                ANNOUNCEMENT_DATE,
                USER_ID
            )
            VALUES(
                :announcement_id,
                :announcement_title,
                :announcement_content,
                :announcement_date,
                :user_id
            )
        `;

        const binds = {
            announcement_id: announcement.id,
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_date: announcement.date,
            user_id: announcement.userId
        }

        return await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async updateAnnouncement(announcement) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            UPDATE ANNOUNCEMENTS
            SET ANNOUNCEMENT_TITLE = :announcement_title,
                ANNOUNCEMENT_CONTENT = :announcement_content,
                ANNOUNCEMENT_DATE = :announcement_date
            WHERE ANNOUNCEMENT_ID = :announcement_id
        `;

        const binds = {
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_date: announcement.date,
            announcement_id: announcement.id
        }

        return await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }

    async deleteAnnouncement(announcementId) {
        if(!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            DELETE FROM ANNOUNCEMENTS
            WHERE ANNOUNCEMENT_ID = :announcement_id
        `

        const binds = {
            announcement_id: announcementId
        }

        return await this.#oracleConnection.execute(query, binds, { autoCommit: true });
    }
}

module.exports = AnnouncementsRepository;
