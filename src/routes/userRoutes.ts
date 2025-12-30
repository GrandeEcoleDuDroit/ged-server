import express from 'express';
import {verifyAuthIdToken, propagateCustomClaims} from '@middlewares/authMiddleware';
import * as userController from '@controllers/userController';
import {
    createUserMiddleware,
    updateProfilePictureMiddleware,
    updateUserMiddleware
} from '@middlewares/userMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get(
    '/',
    verifyAuthIdToken('Error getting users'),
    propagateCustomClaims('Error getting users'),
    userController.getUsers
);

router.get(
    '/:userId',
    verifyAuthIdToken('Error getting user'),
    propagateCustomClaims('Error getting user'),
    userController.getUser
);

router.post(
    '/create',
    verifyAuthIdToken('Error creating user'),
    createUserMiddleware,
    userController.createUser
);

router.put(
    '/:userId',
    verifyAuthIdToken('Error updating user'),
    updateUserMiddleware,
    userController.updateUser
);

router.post(
    '/delete',
    verifyAuthIdToken('Error deleting user'),
    userController.deleteUser
);

router.post(
    '/profile-picture/update',
    verifyAuthIdToken('Error updating profile picture'),
    upload.single('image'),
    updateProfilePictureMiddleware,
    userController.updateProfilePicture
);

router.post(
    '/profile-picture/delete',
    verifyAuthIdToken('Error deleting profile picture'),
    userController.deleteProfilePicture
);

router.post(
    '/report',
    verifyAuthIdToken('Error reporting user'),
    userController.reportUser
);

export default router;