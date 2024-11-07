const express = require('express');
const router = express.Router();
const User = require('../data/model/user');
const UserRepository = require('../data/userRepository');

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
        USER_PROFILE_PICTURE_URL: profilePictureUrl
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
                schoolLevel: ${schoolLevel},
                firstname: ${firstName},
              }`
        };

        return res.status(400).json(serverResponse);
    }

    try {
        const user = new User(id, firstName, lastName, email, schoolLevel, isMember, profilePictureUrl);
        await userRepository.createUser(user);

        const serverResponse = { 
            message: `User ${user.firstName} ${user.lastName} created successfully.` 
        };
        
        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: `Error inserting user ${user.firstName} ${user.lastName}`,
            error: error.message 
        };

        res.status(500).json(serverResponse);
    }
});


router.post('/update/profile-picture-url', async (req, res) => {
    const {
        USER_PROFILE_PICTURE_URL: profilePictureUrl,
        USER_ID: userId
    } = req.body;

    if(!profilePictureUrl && !userId) {
        const serverResponse = {
            message: 'Error updating profile picture url',
            error: `Missing fields : 
            { 
                profilePictureUrl: ${profilePictureUrl},
                userId: ${userId}
            }`
        };

        return res.status(400).json(serverResponse);
    }

    try {
        await userRepository.updateProfilePictureUrl(profilePictureUrl, userId);
        const serverResponse = { 
            message: `Profile picture url updated successfully` 
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = { 
            message: 'Error updating profile picture url',
            error: error.message
        };

        res.status(500).json(serverResponse);
    }
});

router.delete('/profile-picture-url/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteProfilePictureUrl(userId);
        const serverResponse = { message: `Profile picture url deleted successfully` };
        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = { 
            message: 'Error deleting profile picture url',
            error: error.message
        };
        
        res.status(500).json(serverResponse);
    }
});

module.exports = router;
