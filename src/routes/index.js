const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/image', require('./imageRoutes'));
router.use('/announcements', require('./announcementsRoutes'));
router.use('/fcm', require('./fcmRoutes'));
router.use('/white-list', require('./whiteListRoutes'));

module.exports = router;
