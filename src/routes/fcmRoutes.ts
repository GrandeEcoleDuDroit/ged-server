import express from 'express';
const router = express.Router();

import * as fcmController from '@controllers/fcmController';

router.post('/add-token', fcmController.addToken);

router.post('/send-notification', fcmController.sendNotification);

export default router;