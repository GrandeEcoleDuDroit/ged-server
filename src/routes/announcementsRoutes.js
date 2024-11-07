const express = require('express');
const router = express.Router();
const AnnouncementsRepository = require('../data/announcementsRepository');
const Announcement = require("../data/model/announcement");

const announcementsRepository = new AnnouncementsRepository();

router.get('/', async (req, res) => {
    try {
        const result = await announcementsRepository.getAllAnnouncements();
        res.json(result);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error to get all announcements',
            error : error.message
        };

        res.status(500).json(serverResponse);
    }
})

router.post('/create', async (req, res) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if(!content || !date || !userId) {
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

        return res.status(400).json(serverResponse);
    }

    try {
        const announcement = new Announcement(id, title, content, date, userId);
        const result = await announcementsRepository.createAnnouncement(announcement);
        const announcementId = result.outBinds.announcement_id[0];

        const serverResponse = {
            message: `Announcement ${announcementId} created successfully`,
            data: announcementId
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error creating announcement',
            error: error.message
        };

        res.status(500).json(serverResponse)
    }
});

router.post('/update', async (req, res) => {
    const {
        ANNOUNCEMENT_ID: id,
        ANNOUNCEMENT_TITLE: title,
        ANNOUNCEMENT_CONTENT: content,
        ANNOUNCEMENT_DATE: date,
        USER_ID: userId
    } = req.body;

    if(!content || !date || !userId) {
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

        return res.status(400).json(serverResponse);
    }
    
    try {
        const announcement = new Announcement(id, title, content, date, userId);
        await announcementsRepository.updateAnnouncement(announcement);

        const serverResponse = { 
            message: `Announcement ${announcement.id} updated successfully` 
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error updating announcement',
            error: error.message
        };

        res.status(500).json(serverResponse)
    }
});

router.delete('/:id', async (req, res) => {
    const announcementId = req.params.id;

    try {
        await announcementsRepository.deleteAnnouncement(announcementId);
        const serverResponse = { 
            message: `Announcement ${announcementId} deleted successfully` 
        };
        
        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error delete announcement',
            error: error.message
        };

        res.status(500).json(serverResponse);
    }
})

module.exports = router;