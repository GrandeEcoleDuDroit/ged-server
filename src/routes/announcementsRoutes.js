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
        res.status(500).json({
            message: 'Error to get all announcements',
            error : error.message
        });
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
        const errorMessage = {
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

        return res.status(400).json(errorMessage);
    }

    try {
        const formattedDate = new Date(date).toISOString();
        const announcement = new Announcement(id, title, content, formattedDate, userId);
        const result = await announcementsRepository.createAnnouncement(announcement);
        const announcementId = result.outBinds.announcement_id[0];

        const serverResponse = {
            message: `Announcement ${announcementId} created successfully`,
            data: announcementId
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating announcement',
            error: error.message
        })
    }
});

module.exports = router;