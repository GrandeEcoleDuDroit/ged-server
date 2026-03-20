import express from 'express';
import * as announcementsController from '@controllers/announcementsController';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from '@middlewares/authMiddleware';
import {
    deleteAnnouncementMiddleware,
    updateAnnouncementMiddleware
} from '@middlewares/announcementMiddleware';

const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken,
    propagateCustomClaims,
    announcementsController.getAnnouncements
);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    announcementsController.createAnnouncement
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    updateAnnouncementMiddleware,
    announcementsController.updateAnnouncement
);

router.delete(
    '/:announcementId',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    deleteAnnouncementMiddleware,
    announcementsController.deleteAnnouncement
);

router.post(
    '/report',
    verifyAuthIdToken,
    announcementsController.reportAnnouncement
);

export default router;