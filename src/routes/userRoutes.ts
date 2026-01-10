import express from 'express';
import {verifyAuthIdToken, propagateCustomClaims} from '@middlewares/authMiddleware';
import * as userController from '@controllers/userController';
import {createUserMiddleware, updateProfilePictureMiddleware} from '@middlewares/userMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken,
    propagateCustomClaims,
    userController.getUsers
);

router.get(
    '/:userId',
    verifyAuthIdToken,
    propagateCustomClaims,
    userController.getUser
);

router.post(
    '/create',
    verifyAuthIdToken,
    createUserMiddleware,
    userController.createUser
);

router.post(
    '/delete',
    verifyAuthIdToken,
    userController.deleteUser
);

router.post(
    '/profile-picture/update',
    verifyAuthIdToken,
    upload.single('image'),
    updateProfilePictureMiddleware,
    userController.updateProfilePicture
);

router.post(
    '/profile-picture/delete',
    verifyAuthIdToken,
    userController.deleteProfilePicture
);

router.post('/report', verifyAuthIdToken, userController.reportUser);

export default router;