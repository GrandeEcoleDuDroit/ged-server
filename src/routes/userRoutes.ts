import express from 'express';
const router = express.Router();
import {verifyAuthIdToken, propagateCustomClaims} from '@middlewares/authMiddleware';

import * as userController from '@controllers/userController';
import {
    createUserMiddleware,
    updateProfilePictureFileNameMiddleware,
    updateUserMiddleware
} from "@middlewares/userMiddleware";

router.get('/', verifyAuthIdToken, propagateCustomClaims, userController.getUsers);

router.get('/:userId', verifyAuthIdToken, propagateCustomClaims, userController.getUser);

router.post('/create', verifyAuthIdToken, createUserMiddleware, userController.createUser);

router.put('/:userId', verifyAuthIdToken, updateUserMiddleware, userController.updateUser);

router.patch(
    '/profile-picture-file-name',
    verifyAuthIdToken,
    updateProfilePictureFileNameMiddleware,
    userController.updateProfilePictureFileName
);

router.delete('/profile-picture-file-name/:userId', verifyAuthIdToken, userController.deleteProfilePictureFileName);

router.post('/report', verifyAuthIdToken, userController.reportUser);

export default router;