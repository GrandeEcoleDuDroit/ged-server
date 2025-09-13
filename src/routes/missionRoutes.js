const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const missionController = require('@controllers/missionController')

router.post('/create', upload.single('image'), missionController.createMission);

module.exports = router;