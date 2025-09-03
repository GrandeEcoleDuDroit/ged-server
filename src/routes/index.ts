import express from 'express';
import userRoutes from '@routes/userRoutes';
import imageRoutes from '@routes/imageRoutes';
import announcementRoutes from '@routes/announcementsRoutes';
import fcmRoutes from '@routes/fcmRoutes';
import whiteListRoutes from '@routes/whiteListRoutes';
import { verifyAuthIdToken } from "@middlewares/authMiddleware.ts";

export const router = express.Router();

router.use('/users', verifyAuthIdToken, userRoutes);
router.use('/image', verifyAuthIdToken, imageRoutes);
router.use('/announcements', verifyAuthIdToken, announcementRoutes);
router.use('/fcm', verifyAuthIdToken, fcmRoutes);
router.use('/white-list', whiteListRoutes);

export default router;
