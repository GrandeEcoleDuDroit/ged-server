const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/missions/' });

const missionController = require('@controllers/missionController');

router.get('/', missionController.getMissions);

router.post('/create', upload.single('image'), missionController.createMission);

router.post('/delete', missionController.deleteMission);

router.put('/:missionId', upload.single('image'), missionController.updateMission);

module.exports = router;