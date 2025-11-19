import express from 'express';
const router = express.Router();
import * as announcementsController from '@controllers/announcementsController';

router.get('/', announcementsController.getAnnouncements);

router.post('/create', announcementsController.createAnnouncement);

router.post('/update', announcementsController.updateAnnouncement);

router.delete('/user/:userId', announcementsController.deleteUserAnnouncements);

router.delete('/:id', announcementsController.deleteAnnouncement);

router.post('/report', announcementsController.reportAnnouncement);

export default router;