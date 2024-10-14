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
        res.status(500).json(`Error getting user: ${error.message}`);
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

    if (!firstName || !lastName || !email || !schoolLevel) {
        const errorMessage = {
            message: "Error creating user",
            error: `
              All user fields are required :
              {
                firstName: ${firstName},
                lastName: ${lastName},
                email: ${email},
                schoolLevel: ${schoolLevel},
                firstname: ${firstName},
              }`
        }

        return res.status(400).json(errorMessage);
    }

    try {
        const user = new User(id, firstName, lastName, email, schoolLevel, isMember, profilePictureUrl);
        const result = await userRepository.createUser(user);
        const userId = result.outBinds.user_id[0];

        const serverResponse = {
            message: `User ${user.firstName} ${user.lastName} created successfully.`,
            data : userId
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        res.status(500).json(`Error inserting user ${error.message}`);
    }
});


router.post('/update/profile-picture-url', async (req, res) => {
    const {
        USER_PROFILE_PICTURE_URL: profilePictureUrl,
        USER_ID: userId
    } = req.body;

    if(!profilePictureUrl && !userId) {
        const errorMessage = {
            message: "Error updating profile picture url",
            error: `Missing fields : 
            { 
                profilePictureUrl: ${profilePictureUrl},
                userId: ${userId}
            }`
        }

        return res.status(400).json(errorMessage);
    }

    try {
        await userRepository.updateProfilePictureUrl(profilePictureUrl, userId);
        res.status(200).json({
            message: `Profile picture url updated successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating profile picture url',
            error: error.message
        });
    }
});

router.post('/get-user-with-email', async (req, res) => {
    const { USER_EMAIL: userEmail } = req.body;

    if(!userEmail) {
        const errorMessage = {
            message: "Error getting user with email",
            error: `Missing field : 
            { 
                userEmail: ${userEmail}
            }`
        }

        return res.status(400).json(errorMessage);
    }

    try {
        const user = await userRepository.getUserWithEmail(userEmail);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(`Error getting user: ${error.message}`);
    }
});

router.delete('/profile-picture-url/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        await userRepository.deleteProfilePictureUrl(userId);
        res.status(200).json({
            message: `Profile picture url deleted successfully`
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting profile picture url',
            error: error.message
        });
    }
});

module.exports = router;
