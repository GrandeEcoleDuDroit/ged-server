const express = require('express');
const router = express.Router();
const log = require('@utils/logsUtils');

const User = require('@models/user');
const UserRepository = require('@repositories/userRepository');

const userRepository = new UserRepository();

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userRepository.getUser(userId);
        res.status(200).json(user);
    }
    catch (error) {
        const serverResponse = { 
            message: `Error getting user: ${error.message}`,
            error: error.message
        };

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
});

router.post('/create', async (req, res) => {
    const {
        USER_ID: id,
        USER_FIRST_NAME: firstName,
        USER_LAST_NAME: lastName,
        USER_EMAIL: email,
        USER_SCHOOL_LEVEL: schoolLevel,
        USER_IS_MEMBER: isMember,
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName
    } = req.body;

    if (!id || !firstName || !lastName || !email || !schoolLevel) {
        const serverResponse = {
            message: 'Error creating user',
            error: `
              All user fields are required :
              {
                id: ${id},
                firstName: ${firstName},
                lastName: ${lastName},
                email: ${email},
                schoolLevel: ${schoolLevel}
              }`
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const user = new User(id, firstName, lastName, email, schoolLevel, isMember, profilePictureFileName);
        await userRepository.createUser(user);

        const serverResponse = { 
            message: `User ${user.firstName} ${user.lastName} created successfully.` 
        };
        
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: `Error inserting user`,
            error: error.message 
        };

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
});


router.put('/profile-picture-file-name', async (req, res) => {
    const {
        USER_PROFILE_PICTURE_FILE_NAME: profilePictureFileName,
        USER_ID: userId
    } = req.body;

    if(!profilePictureFileName && !userId) {
        const serverResponse = {
            message: 'Error updating profile picture file name',
            error: `Missing fields : 
            { 
                profilePictureFileName: ${profilePictureFileName},
                userId: ${userId}
            }`
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await userRepository.updateProfilePictureFileName(profilePictureFileName, userId);
        const serverResponse = { 
            message: `Profile picture file name updated successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = { 
            message: 'Error updating profile picture file name',
            error: error.message
        };

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
});

router.delete('/profile-picture-file-name/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteProfilePictureFileName(userId);
        const serverResponse = { message: `Profile picture file name deleted successfully` };
        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = { 
            message: 'Error deleting profile picture file name',
            error: error.message
        };
        
        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
});

module.exports = router;
