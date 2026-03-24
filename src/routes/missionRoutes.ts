import express from 'express';
import multer from 'multer';
import * as missionController from '@controllers/missionController';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from '@middlewares/authMiddleware';
import addMissionParticipantMiddleware from '@middlewares/mission/addMissionParticipantMiddleware';
import removeMissionParticipantMiddleware from '@middlewares/mission/removeMissionParticipantMiddleware';
import updateMissionMiddleware from '@middlewares/mission/updateMissionMiddleware';
import deleteMissionMiddleware from "@middlewares/mission/deleteMissionMiddleware";

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
    verifyAuthIdToken,
    upload.single('image'),
    propagateCustomClaims,
    updateMissionMiddleware,
    missionController.updateMission
);

router.delete(
    '/:missionId',
    verifyCustomClaims((claims) => claims.admin == true),
    propagateCustomClaims,
    deleteMissionMiddleware,
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