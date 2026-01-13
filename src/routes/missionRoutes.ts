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
    verifyAuthIdToken,
    propagateCustomClaims,
    missionController.getMissions
);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true),
    upload.single('image'),
    propagateCustomClaims,
    missionController.createMission
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true),
    upload.single('image'),
    propagateCustomClaims,
    missionController.updateMission
);

router.post(
    '/delete',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    missionController.deleteMission
);

router.post(
    '/report',
    verifyAuthIdToken,
    missionController.reportMission
);

router.post(
    '/add-participant',
    verifyAuthIdToken,
    propagateCustomClaims,
    addMissionParticipantMiddleware,
    missionController.addParticipant
);

router.post(
    '/remove-participant',
    verifyAuthIdToken,
    propagateCustomClaims,
    removeMissionParticipantMiddleware,
    missionController.removeParticipant
);

export default router;