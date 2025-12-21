import express from 'express';
import { verifyAuthIdToken } from '@middlewares/authMiddleware';

import userRoutes from '@routes/userRoutes';
import imageRoutes from '@routes/imageRoutes';
import announcementsRoutes from '@routes/announcementsRoutes';
import fcmRoutes from '@routes/fcmRoutes';
import whiteListRoutes from '@routes/whiteListRoutes';
import messageRoutes from '@routes/messageRoutes';
import missionRoutes from '@routes/missionRoutes';

const router = express.Router();

router.use('/users', verifyAuthIdToken, userRoutes);
router.use('/image', verifyAuthIdToken, imageRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/fcm', verifyAuthIdToken, fcmRoutes);
router.use('/white-list', whiteListRoutes);
router.use('/messages', verifyAuthIdToken, messageRoutes);
router.use('/missions', missionRoutes);

export default router;
