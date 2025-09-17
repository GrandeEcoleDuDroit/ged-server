const { oracleDatabaseConnection } = require('@config');
const { sendMail } = require('@data/api/googleApi');

class AnnouncementsRepository {
    async getAllAnnouncements() {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();

            const query = `
                SELECT JSON_OBJECT(*) FROM ANNOUNCEMENTS NATURAL JOIN USERS
            `;

            const result = await connection.execute(query);
            return result.rows.map(row => JSON.parse(row[0]));
        } finally {
            if (connection) await connection.close();
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
        } finally {
            if (connection) await connection.close();
        }
    }

    async updateAnnouncement(announcement) {
        let connection;
        try {
            connection = await oracleDatabaseConnection.getConnection();

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
            };

            return await connection.execute(query, binds, { autoCommit: true });
        } finally {
            if (connection) await connection.close();
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

            const binds = {
                announcement_id: announcementId
            };

            return await connection.execute(query, binds, { autoCommit: true });
        } finally {
            if (connection) await connection.close();
        }
    }

    async reportAnnouncement(report) {
        const subject = `Report Announcement ${report.announcementId}`;
        const html = `
           <p>The announcement ${report.announcementId} has been reported</p>
           <p>Announcement author : ${report.authorInfo.fullName} - <b>${report.authorInfo.email}</b></p>
           <p>Reported by : ${report.userInfo.fullName} - <b>${report.userInfo.email}</b></p>
           <p>Reason : ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}

module.exports = AnnouncementsRepository;
