import express from 'express';
import { verifyAuthIdToken } from '@middlewares/authMiddleware';

import userRoutes from '@routes/userRoutes';
import imageRoutes from '@routes/imageRoutes';
import announcementRoutes from '@routes/announcementRoutes';
import fcmRoutes from '@routes/fcmRoutes';
import whiteListRoutes from '@routes/whiteListRoutes';
import messageRoutes from '@routes/messageRoutes';
import missionRoutes from '@routes/missionRoutes';
import blockUserRoutes from '@routes/blockedUserRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/image', verifyAuthIdToken, imageRoutes);
router.use('/announcements', announcementRoutes);
router.use('/fcm', verifyAuthIdToken, fcmRoutes);
router.use('/white-list', whiteListRoutes);
router.use('/messages', verifyAuthIdToken, messageRoutes);
router.use('/missions', missionRoutes);
router.use('/blocked-users', blockUserRoutes);

export default router;
