import express from 'express';
const router = express.Router();

import * as userController from '@controllers/userController';

router.get('/:userId', userController.getUser);

router.post('/create', userController.createUser);

router.put('/:userId', userController.updateUser);

router.patch('/profile-picture-file-name', userController.updateProfilePictureFileName);

router.delete('/:userId', userController.deleteUser);

router.delete('/profile-picture-file-name/:userId', userController.deleteProfilePicture);

router.post('/report', userController.reportUser);

export default router;