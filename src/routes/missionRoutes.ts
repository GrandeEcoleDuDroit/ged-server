import express from 'express';
import multer from 'multer';
import * as missionController from '@controllers/missionController';
import addMissionParticipantMiddleware from '@middlewares/mission/addMissionParticipantMiddleware';
import removeMissionParticipantMiddleware from '@middlewares/mission/removeMissionParticipantMiddleware';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from '@middlewares/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken('Error getting missions'),
    propagateCustomClaims('Error getting missions'),
    missionController.getMissions
);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true, 'Error creating mission'),
    upload.single('image'),
    propagateCustomClaims('Error creating mission'),
    missionController.createMission
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true, 'Error updating mission'),
    upload.single('image'),
    propagateCustomClaims('Error updating mission'),
    missionController.updateMission
);

router.post(
    '/delete',
    verifyCustomClaims((claims) => claims.admin == true, 'Error deleting mission'),
    propagateCustomClaims('Error deleting mission'),
    missionController.deleteMission
);

router.post(
    '/report',
    verifyAuthIdToken('Error reporting mission'),
    missionController.reportMission
);

router.post(
    '/add-participant',
    verifyAuthIdToken('Error adding mission participant'),
    propagateCustomClaims('Error adding mission participant'),
    addMissionParticipantMiddleware,
    missionController.addParticipant
);

router.post(
    '/remove-participant',
    verifyAuthIdToken('Error removing mission participant'),
    propagateCustomClaims('Error removing mission participant'),
    removeMissionParticipantMiddleware,
    missionController.removeParticipant
);

export default router;