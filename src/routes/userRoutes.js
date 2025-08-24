import express from 'express';
import userController from '#controllers/userController.js';

export const router = express.Router();

router.get('/:userId', userController.getUser);

router.post('/create', userController.createUser);

router.put('/profile-picture-file-name', userController.updateProfilePicture);

router.delete('/profile-picture-file-name/:userId', userController.deleteProfilePicture);

export default router;