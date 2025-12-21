import express from 'express';
import multer from 'multer';
import * as missionController from '@controllers/missionController';
import * as missionMiddleware from '@middlewares/missionMiddleware';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from "@middlewares/authMiddleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/', missionController.getMissions);

router.post(
    '/create',
    verifyCustomClaims((claims) => claims.admin == true),
    upload.single('image'),
    missionController.createMission
);

router.post(
    '/update',
    verifyCustomClaims((claims) => claims.admin == true),
    upload.single('image'),
    missionController.updateMission
);

router.post(
    '/delete',
    verifyCustomClaims((claims) => claims.admin == true),
    missionController.deleteMission
);

router.post('/report', missionController.reportMission);

router.post(
    '/add-participant',
    verifyAuthIdToken,
    missionMiddleware.verifyAddParticipantValidity,
    missionController.addParticipant
);

router.post(
    '/remove-participant',
    verifyAuthIdToken,
    propagateCustomClaims,
    missionMiddleware.verifyRemoveParticipantValidity,
    missionController.removeParticipant
);

export default router;