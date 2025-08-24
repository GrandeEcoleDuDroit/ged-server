import express from 'express';
import announcementsController from "#controllers/announcementsController.js";

export const router = express.Router();

router.get('/', announcementsController.getAnnouncements);

router.post('/create', announcementsController.createAnnouncement);

router.post('/update', announcementsController.updateAnnouncement);

router.delete('/:id', announcementsController.deleteAnnouncement);

export default router;