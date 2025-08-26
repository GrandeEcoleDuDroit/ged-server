const express = require('express');
const router = express.Router();
const { verifyAuthIdToken } = require('@middlewares/authMiddleware');

router.use('/users', verifyAuthIdToken, require('./userRoutes'));
router.use('/image', verifyAuthIdToken, require('./imageRoutes'));
router.use('/announcements', verifyAuthIdToken, require('./announcementsRoutes'));
router.use('/fcm', verifyAuthIdToken, require('./fcmRoutes'));
router.use('/white-list', require('./whiteListRoutes'));

module.exports = router;
