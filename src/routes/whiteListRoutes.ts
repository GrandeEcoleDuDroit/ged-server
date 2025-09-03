import express from 'express';
import whiteListController from '@controllers/whiteListController';

export const router = express.Router();

router.post('/user', whiteListController.checkUserWhiteList);

export default router;