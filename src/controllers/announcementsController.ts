import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import type { Announcement, AnnouncementReport } from '@models/announcement';
import AnnouncementRepository from '@repositories/announcementRepository';
import {formatOracleError, invalidFieldsErrorMessage} from '@utils/exceptionUtils';
import type {ServerResponse} from '@models/serverResponse';

const announcementsRepository = new AnnouncementRepository();

export const getAnnouncements = async (req: Request, res: Response) => {
    const announcementTest = req.claims?.tester ?? false;

    try {
        const result = await announcementsRepository.getAnnouncements(announcementTest);
        res.json(result);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error getting announcements',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const createAnnouncement = async (req: Request, res: Response) => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!content || !date || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error creating announcement',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const announcement: Announcement = {
            id: id,
            title: title,
            content: content,
            date: date,
            test: announcementTest,
            userId: userId
        };
        await announcementsRepository.createAnnouncement(announcement);
        const serverResponse: ServerResponse = { message: 'Announcement created successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error creating announcement', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!id || !content || !date || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error updating announcement',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        const announcement: Announcement = {
            id: id,
            title: title,
            content: content,
            date: date,
            test: announcementTest,
            userId: userId
        };
        await announcementsRepository.updateAnnouncement(announcement);
        const serverResponse: ServerResponse = { message: 'Announcement updated successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error updating announcement', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const deleteUserAnnouncements = async (req: Request, res: Response) => {
    const announcementTest = req.claims?.tester ?? false;
    const userId = req.params.userId;

    try {
        await announcementsRepository.deleteUserAnnouncements(userId, announcementTest);
        const serverResponse: ServerResponse = { message: 'User announcements deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error) {
        const serverResponse: ServerResponse = formatOracleError('Error deleting user announcements', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: announcementId,
        USER_ID: userId
    } = req.body;

    if (!announcementId || !userId) {
        const serverResponse: ServerResponse = {
            message: 'Error deleting announcement',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    try {
        await announcementsRepository.deleteAnnouncement(announcementId, announcementTest, userId);
        const serverResponse: ServerResponse = { message: 'Announcement deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = formatOracleError('Error deleting announcement', error);
        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const reportAnnouncement = async (req: Request, res: Response) => {
    const {
        announcementId: announcementId,
        author: author,
        reporter: reporter,
        reason: reason
    } = req.body;

    if (!announcementId || !author || !reporter || !reason) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting announcement',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    const report: AnnouncementReport = {
        announcementId: announcementId,
        author: author,
        reporter: reporter,
        reason: reason
    };

    try {
        await announcementsRepository.reportAnnouncement(report);
        const serverResponse: ServerResponse = { message: `Announcement reported successfully` };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting announcement',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};
