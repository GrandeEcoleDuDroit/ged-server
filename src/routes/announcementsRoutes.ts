import express from 'express';
import * as announcementsController from '@controllers/announcementsController';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from "@middlewares/authMiddleware";
import {
    deleteAnnouncementMiddleware,
    deleteUserAnnouncementMiddleware,
    updateAnnouncementMiddleware
} from "@middlewares/announcementMiddleware";

const router = express.Router();

router.get('/', verifyAuthIdToken, propagateCustomClaims, announcementsController.getAnnouncements);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    announcementsController.createAnnouncement
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true),
    updateAnnouncementMiddleware,
    propagateCustomClaims,
    announcementsController.updateAnnouncement
);

router.delete(
    '/user/:userId',
    verifyCustomClaims((claims) => claims.admin == true),
    deleteUserAnnouncementMiddleware,
    propagateCustomClaims,
    announcementsController.deleteUserAnnouncements
);

router.post(
    "/delete",
    verifyCustomClaims((claims) => claims.admin == true),
    deleteAnnouncementMiddleware,
    propagateCustomClaims,
    announcementsController.deleteAnnouncement
);

router.post('/report', announcementsController.reportAnnouncement);

export default router;