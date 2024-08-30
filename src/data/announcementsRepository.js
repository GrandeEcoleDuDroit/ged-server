const oracledb = require('oracledb');
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
            SELECT JSON_OBJECT(
                'ANNOUNCEMENT_ID' VALUE TO_NUMBER(ANNOUNCEMENT_ID),
                'ANNOUNCEMENT_TITLE' VALUE TO_CHAR(ANNOUNCEMENT_TITLE),
                'ANNOUNCEMENT_CONTENT' VALUE TO_CHAR(ANNOUNCEMENT_CONTENT),
                'ANNOUNCEMENT_DATE' VALUE TO_NUMBER(ANNOUNCEMENT_DATE),
                'USER_ID' VALUE TO_NUMBER(USER_ID)
            )
            FROM ANNOUNCEMENTS;
        `;

        const resultRequest = await this.#oracleConnection.execute(query);
        return resultRequest.rows.map(row => JSON.parse(row[0]));
    }

    async createAnnouncement(announcement) {
        if (!this.#oracleConnection) {
            throw 'Database connection not established';
        }

        const query = `
            INSERT INTO ANNOUNCEMENTS(
                ANNOUNCEMENT_TITLE,
                ANNOUNCEMENT_CONTENT,
                ANNOUNCEMENT_DATE,
                USER_ID    
            )
            VALUES(
                :announcement_title,
                :announcement_content,
                :announcement_date,
                :user_id    
            )
            RETURNING ANNOUNCEMENT_ID INTO :announcement_id
        `;

        const binds = {
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_date: announcement.date,
            user_id: announcement.userId,
            announcement_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
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