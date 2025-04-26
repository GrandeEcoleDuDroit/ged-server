const express = require('express');
const router = express.Router();

const fcmController = require('@controllers/fcmController');

router.post('/addToken', fcmController.addToken);

router.post('/sendNotification', fcmController.sendNotification);

module.exports = router;