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
        fcmToken: tokenValue
    } = req.body;

    if(!userId || !tokenValue) {
        const serverResponse = {
            message: "Error to add fcm token",
            error: `
            Some missing fields : 
            {
                userId: ${userId},
                fcmToken: ${tokenValue}
            }
            `
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const fcmToken = new FCMToken(userId, tokenValue);
    credentialsRepository.upsertToken(fcmToken, FCMToken.fileName())
        .then(_ => {
            const serverResponse = {
                message: 'FCM token added successfully'
            };

            res.status(201).json(serverResponse);
        })
        .catch((error) => {
            const serverResponse = {
                message: 'Error adding FCM token',
                error: error.message
            };

            log.error(serverResponse.message, error);
            res.status(500).json(serverResponse)
        })
});

router.post('/notification/message', async (req, res) => {
    const { userId, message } = req.body;
    const fcmToken = await credentialsRepository.getTokenValue(userId);

    const notificationMessage = {
        notification: {
            title: "New Message",
            body: "You have a new message !",
        },
        data: JSON.stringify(message),
        token: fcmToken
    };

    credentialsRepository.sendNotification(notificationMessage)
        .then(_ => {
            const serverResponse = {
                message: 'Notification sent successfully',
            };

            res.status(201).json(serverResponse);
        })
        .catch((error) => {
            const serverResponse = {
                message: 'Error adding FCM token',
                error: error.message
            };

            log.error(serverResponse.message, error);
            res.status(500).json(serverResponse)
        })
})

module.exports = router;