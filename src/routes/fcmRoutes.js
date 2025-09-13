const express = require('express');
const router = express.Router();

const fcmController = require('@controllers/fcmController');

router.post('/add-token', fcmController.addToken);

router.post('/send-notification', fcmController.sendNotification);

router.post('/remove-notification', fcmController.removeNotification);

module.exports = router;