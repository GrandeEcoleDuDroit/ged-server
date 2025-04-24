const express = require('express');
const router = express.Router();

const userController = require("@controllers/userController")

router.get('/:userId', userController.getUser);

router.post('/create', userController.createUser);

router.put('/profile-picture-file-name', userController.updateProfilePicture);

router.delete('/profile-picture-file-name/:userId', userController.deleteProfilePicture);

module.exports = router;
