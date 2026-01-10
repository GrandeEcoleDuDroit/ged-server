import express from 'express';
import * as fcmController from '@controllers/fcmController';
import {verifyAuthIdToken} from '@middlewares/authMiddleware';
import {sendNotificationMiddleware} from "@middlewares/sendNotificationMiddleware";

const router = express.Router();

router.post('/add-token', verifyAuthIdToken, fcmController.addToken);

router.post('/delete-token', fcmController.deleteToken);

router.post('/send-notification', verifyAuthIdToken, sendNotificationMiddleware, fcmController.sendNotification);

export default router;