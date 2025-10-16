const express = require('express');
const router = express.Router();

const userController = require('@controllers/userController')

router.get('/:userId', userController.getUser);

router.post('/create', userController.createUser);

router.put('/:userId', userController.updateUser);

router.patch('/profile-picture-file-name', userController.updateProfilePicture);

router.delete('/:userId', userController.deleteUser);

router.delete('/profile-picture-file-name/:userId', userController.deleteProfilePicture);

router.post('/report', userController.reportUser);

module.exports = router;
