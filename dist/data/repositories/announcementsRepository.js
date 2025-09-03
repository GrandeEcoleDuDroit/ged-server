import { oracleDatabaseConnection } from '../../config/index.ts';
export class AnnouncementsRepository {
    async getAllAnnouncements() {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `SELECT JSON_OBJECT(*) FROM ANNOUNCEMENTS NATURAL JOIN USERS`;
            const result = await connection.execute(query);
            return result.rows?.map(row => {
                const r = row;
                return JSON.parse(r[0]);
            }) ?? [];
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async createAnnouncement(announcement) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
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
            };
            return await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async updateAnnouncement(announcement) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `
                UPDATE ANNOUNCEMENTS
                SET 
                    ANNOUNCEMENT_TITLE = :announcement_title,
                    ANNOUNCEMENT_CONTENT = :announcement_content,
                    ANNOUNCEMENT_DATE = :announcement_date
                WHERE ANNOUNCEMENT_ID = :announcement_id
            `;
            const binds = {
                announcement_title: announcement.title,
                announcement_content: announcement.content,
                announcement_date: announcement.date,
                announcement_id: announcement.id
            };
            return await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
    async deleteAnnouncement(announcementId) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();
            const query = `
                DELETE FROM ANNOUNCEMENTS
                WHERE ANNOUNCEMENT_ID = :announcement_id
            `;
            const binds = { announcement_id: announcementId };
            return await connection.execute(query, binds, { autoCommit: true });
        }
        finally {
            if (connection)
                await connection.close();
        }
    }
}
