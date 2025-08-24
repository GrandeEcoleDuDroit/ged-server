import express from 'express';
import userRoutes from '#routes/userRoutes.js';
import imageRoutes from '#routes/imageRoutes.js';
import announcementsRoutes from '#routes/announcementsRoutes.js';
import fcmRoutes from '#routes/fcmRoutes.js';
import whiteListRoutes from '#routes/whiteListRoutes.js';

export const router = express.Router();

router.use('/users', userRoutes);
router.use('/image', imageRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/fcm', fcmRoutes);
router.use('/white-list', whiteListRoutes);

export default router;
