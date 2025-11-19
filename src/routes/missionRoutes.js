const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/missions/' });

const missionController = require('@controllers/missionController');
const missionMiddleware = require('@middlewares/missionMiddleware')

router.get('/', missionController.getMissions);

router.post('/create', upload.single('image'), missionController.createMission);

router.put('/:missionId', upload.single('image'), missionController.updateMission);

router.post('/delete', missionController.deleteMission);

router.post('/report', missionController.reportMission);

router.post('/add-participant', missionMiddleware.verifyAddParticipantValidity, missionController.addParticipant);

router.post('/remove-participant', missionController.removeParticipant);

module.exports = router;