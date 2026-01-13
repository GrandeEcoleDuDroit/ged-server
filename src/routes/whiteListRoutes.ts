import express from 'express';
import * as whiteListController from '@controllers/whiteListController';

const router = express.Router();

router.post('/user', whiteListController.verifyUserWhiteList);

export default router;