const express = require('express');
const router = express.Router();
const announcementsController = require("@controllers/announcementsController")

router.get('/', announcementsController.getAnnouncements);

router.post('/create', announcementsController.createAnnouncement);

router.post('/update', announcementsController.updateAnnouncement);

router.delete('/user/:userId', announcementsController.deleteAnnouncements);

router.delete('/:id', announcementsController.deleteAnnouncement);

router.post('/report', announcementsController.reportAnnouncement);

module.exports = router;