import express from 'express';
const router = express.Router();
import * as announcementsController from '@controllers/announcementsController';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from "@middlewares/authMiddleware";

router.get('/', verifyAuthIdToken, propagateCustomClaims, announcementsController.getAnnouncements);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true),
    announcementsController.createAnnouncement
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    announcementsController.updateAnnouncement
);

router.delete(
    '/user/:userId',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    announcementsController.deleteUserAnnouncements
);

router.post(
    "/delete",
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    announcementsController.deleteAnnouncement
);

router.post('/report', announcementsController.reportAnnouncement);

export default router;