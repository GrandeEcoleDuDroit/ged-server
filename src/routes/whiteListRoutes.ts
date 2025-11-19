import express from 'express';
const router = express.Router();

import * as whiteListController from '@controllers/whiteListController';

router.post('/user', whiteListController.checkUserWhiteList);

export default router;