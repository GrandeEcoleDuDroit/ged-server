const express = require('express');
const router = express.Router();
const announcementsRepository = require('../data/announcementsRepository');

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

module.exports = router;