require('dotenv').config();
const express = require('express');
const router = express.Router();
const log = require('@utils/logsUtils');
const CredentialsRepository = require('@repositories/credentialsRepository');
const FCMToken = require('@models/token');
const credentialsRepository = new CredentialsRepository();

router.post('/fcmToken/add', async (req, res) => {
    const {
        userId: userId,
        fcmToken: fcmToken
    } = req.body;

    if(!userId || !fcmToken) {
        const serverResponse = {
            message: "Error to add fcm token",
            error: `
            Some missing fields : 
            {
                userId: ${userId},
                fcmToken: ${fcmToken}
            }
            `
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = new FCMToken(userId, fcmToken);
        await credentialsRepository.upsertToken(fcmToken, FCMToken.getFileName());

        const serverResponse = {
            message: 'FCM token added successfully'
        };

        res.status(201).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: 'Error adding FCM token',
            error: error.message
        };

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
});

module.exports = router;