import express from 'express';
const router = express.Router();

import * as messageController from '@controllers/messageController';

router.post('/report', messageController.reportMessage);

export default router;