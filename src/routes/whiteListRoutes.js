import express from 'express';
import whiteListController from '#controllers/whiteListController.js';

export const router = express.Router();

router.post('/user', whiteListController.checkUserWhiteList);

export default router;