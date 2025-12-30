import express from 'express';
import * as announcementsController from '@controllers/announcementsController';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from '@middlewares/authMiddleware';
import {
    deleteAnnouncementMiddleware,
    deleteUserAnnouncementMiddleware,
    updateAnnouncementMiddleware
} from '@middlewares/announcementMiddleware';

const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken('Error getting announcements'),
    propagateCustomClaims('Error getting announcements'),
    announcementsController.getAnnouncements
);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true, 'Error creating announcement'),
    propagateCustomClaims('Error creating announcement'),
    announcementsController.createAnnouncement
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true, 'Error updating announcement'),
    propagateCustomClaims('Error updating announcement'),
    updateAnnouncementMiddleware,
    announcementsController.updateAnnouncement
);

router.delete(
    '/user/:userId',
    verifyCustomClaims((claims) => claims.admin == true, 'Error deleting user announcements'),
    propagateCustomClaims('Error deleting user announcements'),
    deleteUserAnnouncementMiddleware,
    announcementsController.deleteUserAnnouncements
);

router.post(
    '/delete',
    verifyCustomClaims((claims) => claims.admin == true, 'Error deleting announcement'),
    propagateCustomClaims('Error deleting announcement'),
    deleteAnnouncementMiddleware,
    announcementsController.deleteAnnouncement
);

router.post(
    '/report',
    verifyAuthIdToken('Error reporting announcement'),
    announcementsController.reportAnnouncement
);

export default router;