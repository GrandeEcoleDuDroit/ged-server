import type {NextFunction, Request, Response} from 'express';
import {forbiddenErrorResponse, internalServerErrorResponse} from '@utils/errorUtils';
import MissionRepository from "@repositories/missionRepository";
import AnnouncementRepository from "@repositories/announcementRepository";
import {e} from "@utils/logs";

const announcementRepository = new AnnouncementRepository();

export const updateAnnouncementMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { USER_ID: userId } = req.body;

    if (userId != req.uid) {
        res.status(403).json(forbiddenErrorResponse);
        return;
    }

    next();
};

export const deleteAnnouncementMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const announcementId = req.params.announcementId;
    const announcementTest = req.claims?.tester ?? false;

    try {
        const announcement = await announcementRepository.getAnnouncement(announcementId, announcementTest)

        if (!announcement) {
            res.status(204);
            return;
        }

        if (announcement.USER_ID != req.uid) {
            res.status(403).json(forbiddenErrorResponse);
            return;
        }

        next();
    } catch (error: any) {
        e(new Error(`Error deleting announcement ${announcementId}: ${error.message}`),);
        res.status(500).json(internalServerErrorResponse);
    }
};