import express from 'express';
import * as messageController from '@controllers/messageController';
import {verifyAuthIdToken} from '@middlewares/authMiddleware';

const router = express.Router();

router.post('/report', verifyAuthIdToken, messageController.reportMessage);

export default router;