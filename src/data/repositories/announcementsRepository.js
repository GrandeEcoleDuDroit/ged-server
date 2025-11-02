const oracleApi = require('@api/oracleApi');
const { sendMail } = require('@api/googleApi');
const AnnouncementField = require('@fields/announcementField')
const UserField = require('@fields/userField')
class AnnouncementsRepository {
    async getAllAnnouncements() {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${AnnouncementField.TABLE_NAME} 
            NATURAL JOIN ${UserField.TABLE_NAME}
        `;

        const result = await oracleApi.execute(query);
        return result.rows.map(row => JSON.parse(row[0]));
    }

    async createAnnouncement(announcement) {
        const query = `
            INSERT INTO ${AnnouncementField.TABLE_NAME}(
                ${AnnouncementField.ANNOUNCEMENT_ID},
                ${AnnouncementField.ANNOUNCEMENT_TITLE},
                ${AnnouncementField.ANNOUNCEMENT_CONTENT},
                ${AnnouncementField.ANNOUNCEMENT_DATE},
                ${AnnouncementField.USER_ID}
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

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateAnnouncement(announcement) {
        const query = `
            UPDATE ${AnnouncementField.TABLE_NAME}
            SET ${AnnouncementField.ANNOUNCEMENT_TITLE} = :announcement_title,
                ${AnnouncementField.ANNOUNCEMENT_CONTENT} = :announcement_content,
                ${AnnouncementField.ANNOUNCEMENT_DATE} = :announcement_date
            WHERE ${AnnouncementField.ANNOUNCEMENT_ID} = :announcement_id
        `;

        const binds = {
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_date: announcement.date,
            announcement_id: announcement.id
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteAnnouncements(userId) {
            const query = `
            DELETE FROM ${AnnouncementField.TABLE_NAME}
            WHERE ${AnnouncementField.USER_ID} = :user_id
        `;

        const binds = {
            user_id: userId
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteAnnouncement(announcementId) {
        const query = `
            DELETE FROM ${AnnouncementField.TABLE_NAME}
            WHERE ${AnnouncementField.ANNOUNCEMENT_ID} = :announcement_id
        `;

        const binds = {
            announcement_id: announcementId
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
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

module.exports = new AnnouncementsRepository();
