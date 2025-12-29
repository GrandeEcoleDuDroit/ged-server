import OracleApi from '@api/oracleApi';
import { sendMail } from '@api/googleApi';
import AnnouncementField from '@fields/announcementField';
import {UserField} from '@fields/userField';
import type { Announcement, AnnouncementReport } from '@models/announcement';

const oracleApi = OracleApi.instance;

export default class AnnouncementRepository {
    async getAnnouncements(announcementTest: boolean): Promise<Announcement[]> {
        const query = `
            SELECT JSON_OBJECT(*) 
            FROM ${AnnouncementField.TABLE_NAME} 
            NATURAL JOIN ${UserField.TABLE_NAME}
            WHERE ${AnnouncementField.ANNOUNCEMENT_TEST} = :announcement_test
        `;
        const binds = { announcement_test: announcementTest ? 1 : 0 };

        const result = await oracleApi.execute(query, binds);
        return result.rows?.map(row =>
            JSON.parse(row as [string][0]) as Announcement
        ) ?? [];
    }

    async createAnnouncement(announcement: Announcement) {
        const query = `
            INSERT INTO ${AnnouncementField.TABLE_NAME}(
                ${AnnouncementField.ANNOUNCEMENT_ID},
                ${AnnouncementField.ANNOUNCEMENT_TITLE},
                ${AnnouncementField.ANNOUNCEMENT_CONTENT},
                ${AnnouncementField.ANNOUNCEMENT_DATE},
                ${AnnouncementField.ANNOUNCEMENT_TEST},
                ${AnnouncementField.USER_ID}
            )
            VALUES(
                :announcement_id,
                :announcement_title,
                :announcement_content,
                :announcement_date,
                :announcement_test,
                :user_id
            )
        `;

        const binds = {
            announcement_id: announcement.id,
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_date: announcement.date,
            announcement_test: announcement.test ? 1 : 0,
            user_id: announcement.userId
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async updateAnnouncement(announcement: Announcement) {
        const query = `
            UPDATE ${AnnouncementField.TABLE_NAME}
            SET ${AnnouncementField.ANNOUNCEMENT_TITLE} = :announcement_title,
                ${AnnouncementField.ANNOUNCEMENT_CONTENT} = :announcement_content
            WHERE ${AnnouncementField.ANNOUNCEMENT_ID} = :announcement_id
              AND ${AnnouncementField.ANNOUNCEMENT_TEST} = :announcement_test 
        `;

        const binds = {
            announcement_title: announcement.title,
            announcement_content: announcement.content,
            announcement_id: announcement.id,
            announcement_test: announcement.test ? 1 : 0
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteUserAnnouncements(userId: string, announcementTest: boolean) {
        const query = `
            DELETE FROM ${AnnouncementField.TABLE_NAME}
            WHERE ${AnnouncementField.USER_ID} = :user_id 
              AND ${AnnouncementField.ANNOUNCEMENT_TEST} = :announcement_test 
        `;

        const binds = {
            user_id: userId,
            announcement_test: announcementTest ? 1 : 0
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async deleteAnnouncement(announcementId: string, announcementTest: boolean, userId: string) {
        const query = `
            DELETE FROM ${AnnouncementField.TABLE_NAME}
            WHERE ${AnnouncementField.ANNOUNCEMENT_ID} = :announcement_id 
              AND ${AnnouncementField.USER_ID} = :user_id
              AND ${AnnouncementField.ANNOUNCEMENT_TEST} = :announcement_test
        `;

        const binds = {
            announcement_id: announcementId,
            announcement_test: announcementTest ? 1 : 0,
            user_id: userId
        };

        return await oracleApi.execute(query, binds, { autoCommit: true });
    }

    async reportAnnouncement(report: AnnouncementReport) {
        const subject = `Announcement report: ${report.announcementId}`;
        const html = `
           <p>The announcement ${report.announcementId} has been reported</p>
           <p>Announcement author: ${report.author.fullName} - <b>${report.author.email}</b></p>
           <p>Reported by: ${report.reporter.fullName} - <b>${report.reporter.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}