import express from 'express';
import fcmController from '@controllers/fcmController';

export const router = express.Router();

router.post('/add-token', fcmController.addToken);

router.post('/send-notification', fcmController.sendNotification);

export default router;