import type { Request, Response } from 'express';
import { e } from '@utils/logs';
import type { Announcement, AnnouncementReport } from '@models/announcement';
import AnnouncementRepository from '@repositories/announcementRepository';
import {
    oracleErrorResponse,
    internalServerErrorResponse,
    badRequestErrorResponse
} from '@utils/errorUtils';
import type {ServerResponse} from '@models/serverResponse';

const announcementsRepository = new AnnouncementRepository();

export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
    const announcementTest = req.claims?.tester ?? false;

    try {
        const result = await announcementsRepository.getAnnouncements(announcementTest);
        res.json(result);
    } catch (error: any) {
        e(new Error(`Error getting announcements: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};

export const createAnnouncement = async (req: Request, res: Response): Promise<void> => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!content || !date || !userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    const announcement: Announcement = {
        id: id,
        title: title,
        content: content,
        date: date,
        test: announcementTest,
        userId: userId
    };

    try {
        await announcementsRepository.createAnnouncement(announcement);
        const serverResponse: ServerResponse = { message: 'Announcement created successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error creating announcement: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};

export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if (!id || !content || !date || !userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    const announcement: Announcement = {
        id: id,
        title: title,
        content: content,
        date: date,
        test: announcementTest,
        userId: userId
    };

    try {
        await announcementsRepository.updateAnnouncement(announcement);
        const serverResponse: ServerResponse = { message: 'Announcement updated successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error updating announcement ${announcement.id} : ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};

export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
    const announcementTest = req.claims?.tester ?? false;
    const {
        ANNOUNCEMENT_ID: announcementId,
        USER_ID: userId
    } = req.body;

    if (!announcementId || !userId) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    try {
        await announcementsRepository.deleteAnnouncement(announcementId, announcementTest, userId);
        const serverResponse: ServerResponse = { message: 'Announcement deleted successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error deleting announcement ${announcementId} : ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
};

export const reportAnnouncement = async (req: Request, res: Response): Promise<void> => {
    const {
        announcementId: announcementId,
        author: author,
        reporter: reporter,
        reason: reason
    } = req.body;

    if (!announcementId || !author || !reporter || !reason) {
        res.status(400).json(badRequestErrorResponse);
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
        e(new Error(`Error reporting announcement ${announcementId}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
};
