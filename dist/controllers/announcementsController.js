import { e } from '../utils/logs.ts';
import { AnnouncementsRepository } from '../data/repositories/announcementsRepository.ts';
import { Announcement } from "../data/models/announcement.ts";
import { formatOracleError } from "../utils/exceptionUtils.ts";
const announcementsRepository = new AnnouncementsRepository();
export const getAnnouncements = async (req, res) => {
    try {
        const result = await announcementsRepository.getAllAnnouncements();
        return res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            const serverResponse = {
                message: 'Error to get all announcements',
                error: error.message
            };
            e(serverResponse.message, error);
            return res.status(500).json(serverResponse);
        }
        else {
            return res.status(500).json(error);
        }
    }
};
export const createAnnouncement = async (req, res) => {
    const { ANNOUNCEMENT_ID: id, ANNOUNCEMENT_TITLE: title, ANNOUNCEMENT_CONTENT: content, ANNOUNCEMENT_DATE: date, USER_ID: userId } = req.body;
    if (!content || !date || !userId) {
        const serverResponse = {
            message: "Error to create announcement",
            error: `
            Some missing announcement fields : 
            {
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };
        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }
    try {
        const announcement = new Announcement(id, title, content, date, userId);
        await announcementsRepository.createAnnouncement(announcement);
        const serverResponse = {
            message: `Announcement created successfully`
        };
        return res.status(201).json(serverResponse);
    }
    catch (error) {
        if (error instanceof Error) {
            const serverResponse = formatOracleError(error, 'Error creating announcement');
            e(serverResponse.message, error);
            return res.status(500).json(serverResponse);
        }
        else {
            return res.status(500).json(error);
        }
    }
};
export const updateAnnouncement = async (req, res) => {
    const { ANNOUNCEMENT_ID: id, ANNOUNCEMENT_TITLE: title, ANNOUNCEMENT_CONTENT: content, ANNOUNCEMENT_DATE: date, USER_ID: userId } = req.body;
    if (!content || !date || !userId) {
        const serverResponse = {
            message: "Error to update announcement",
            error: `
            Some missing announcement fields : 
            {
                content: ${content},
                date: ${date},
                userId: ${userId}
            }
            `
        };
        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }
    try {
        const announcement = new Announcement(id, title, content, date, userId);
        await announcementsRepository.updateAnnouncement(announcement);
        const serverResponse = {
            message: `Announcement ${announcement.id} updated successfully`
        };
        return res.status(201).json(serverResponse);
    }
    catch (error) {
        if (error instanceof Error) {
            const serverResponse = formatOracleError(error, 'Error updating announcement');
            e(serverResponse.message, error);
            return res.status(500).json(serverResponse);
        }
        else {
            return res.status(500).json(error);
        }
    }
};
export const deleteAnnouncement = async (req, res) => {
    const announcementId = req.params.id;
    if (!announcementId) {
        const serverResponse = {
            message: "Error to delete announcement",
            error: `
            Missing announcement id : 
            {
                announcementId: ${announcementId}
            }
            `
        };
        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }
    try {
        await announcementsRepository.deleteAnnouncement(announcementId);
        const serverResponse = {
            message: `Announcement ${announcementId} deleted successfully`
        };
        return res.status(200).json(serverResponse);
    }
    catch (error) {
        if (error instanceof Error) {
            const serverResponse = formatOracleError(error, 'Error delete announcement');
            e(serverResponse.message, error);
            return res.status(500).json(serverResponse);
        }
        else {
            return res.status(500).json(error);
        }
    }
};
export default {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};
