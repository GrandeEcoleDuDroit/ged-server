import express from 'express';
const router = express.Router();

import * as missionController from '@controllers/missionController';
import * as missionMiddleware from '@middlewares/missionMiddleware';

router.get('/', missionController.getMissions);

router.post('/create', missionController.createMission);

router.put('/:missionId', missionController.updateMission);

router.post('/delete', missionController.deleteMission);

router.post('/report', missionController.reportMission);

router.post('/add-participant', missionMiddleware.verifyAddParticipantValidity, missionController.addParticipant);

router.post('/remove-participant', missionController.removeParticipant);

export default router;