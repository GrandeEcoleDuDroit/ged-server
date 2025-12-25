import express from 'express';
import multer from 'multer';
import * as missionController from '@controllers/missionController';
import * as missionMiddleware from '@middlewares/missionMiddleware';
import {propagateCustomClaims, verifyAuthIdToken, verifyCustomClaims} from "@middlewares/authMiddleware";

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
    missionMiddleware.addParticipantMiddleware,
    missionController.addParticipant
);

router.post(
    '/remove-participant',
    verifyAuthIdToken,
    propagateCustomClaims,
    missionMiddleware.removeParticipantMiddleware,
    missionController.removeParticipant
);

export default router;