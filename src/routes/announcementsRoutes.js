const express = require('express');
const router = express.Router();
const announcementsController = require("@controllers/announcementsController")

router.get('/', announcementsController.getAnnouncements);

router.post('/create', announcementsController.createAnnouncement);

router.post('/update', announcementsController.updateAnnouncement);

router.delete('/:id', announcementsController.deleteAnnouncement);

module.exports = router;