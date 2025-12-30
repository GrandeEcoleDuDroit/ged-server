import express from 'express';
import {verifyAuthIdToken} from '@middlewares/authMiddleware';
import * as blockedUserController from '@controllers/blockedUserController';

const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken('Error getting blocked users'),
    blockedUserController.getBlockedUserIds
);

router.post(
    '/create',
    verifyAuthIdToken('Error adding blocked user'),
    blockedUserController.addBlockedUser
);

router.delete(
    '/:userId',
    verifyAuthIdToken('Error removing blocked user'),
    blockedUserController.removeBlockedUser
);

export default router;