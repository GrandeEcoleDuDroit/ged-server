const express = require('express');
const router = express.Router();

const whiteListController = require('@controllers/whiteListController');

router.post('/user', whiteListController.checkUserWhiteList);

module.exports = router;