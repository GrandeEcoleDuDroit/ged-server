import express from 'express';
import * as fcmController from '@controllers/fcmController';
import {verifyAuthIdToken} from '@middlewares/authMiddleware';

const router = express.Router();

router.post(
    '/add-token',
    verifyAuthIdToken('Error adding token'),
    fcmController.addToken
);

router.post('/delete-token', fcmController.deleteToken);

router.post(
    '/send-notification',
    verifyAuthIdToken('Error sending notification'),
    fcmController.sendNotification
);

export default router;