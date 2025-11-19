import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import type { Announcement, AnnouncementReport } from '@models/announcement';
import AnnouncementsRepository from '@repositories/announcementsRepository';
import { formatOracleError } from '@utils/exceptionUtils';

const announcementsRepository = new AnnouncementsRepository();

export const getAnnouncements = async (_: Request, res: Response) => {
    try {
        const result = await announcementsRepository.getAnnouncements();
        res.json(result);
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const serverResponse = {
            message: 'Error to get announcements',
            error: errorMessage
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const createAnnouncement = async (req: Request, res: Response) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!content || !date || !userId) {
        const serverResponse = {
            message: "Error to create announcement",
            error: `
            Some missing announcement fields: 
            {
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const announcement: Announcement = { id, title, content, date, userId };
        await announcementsRepository.createAnnouncement(announcement);
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error creating announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!id || !content || !date || !userId) {
        const serverResponse = {
            message: "Error to update announcement",
            error: `
            Some missing announcement fields: 
            {
                id: ${id},
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const announcement: Announcement = { id, title, content, date, userId };
        await announcementsRepository.updateAnnouncement(announcement);
        res.status(201).json({ message: `Announcement ${announcement.id} updated successfully` });
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error updating announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const deleteUserAnnouncements = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        await announcementsRepository.deleteUserAnnouncements(userId);
        res.status(200).json({ message: `Announcements of ${userId} have been deleted successfully` });
    } catch (error) {
        const serverResponse = formatOracleError(error, 'Error deleting announcements');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    const announcementId = req.params.announcementId;

    try {
        await announcementsRepository.deleteAnnouncement(announcementId);
        res.status(200).json({ message: `Announcement ${announcementId} deleted successfully` });
    } catch (error: any) {
        const serverResponse = formatOracleError(error, 'Error deleting announcement');
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const reportAnnouncement = async (req: Request, res: Response) => {
    const { announcementId, authorInfo, userInfo, reason } = req.body;

    if (!announcementId || !authorInfo || !userInfo || !reason) {
        const serverResponse = {
            message: "Error to report announcement",
            error: `
            Some missing report fields:
            {
                announcementId: ${announcementId},
                authorInfo: ${authorInfo},
                userInfo: ${userInfo},
                reason: ${reason}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(400).json(serverResponse);
        return;
    }

    const report: AnnouncementReport = { announcementId, authorInfo, userInfo, reason };

    try {
        await announcementsRepository.reportAnnouncement(report);
        res.status(200).json({ message: `Announcement ${announcementId} reported successfully` });
    } catch (error: any) {
        const serverResponse = {
            message: 'Error reporting announcement',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};
