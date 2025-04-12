require('dotenv').config();
const express = require('express');
const router = express.Router();
const log = require('@utils/logsUtils');
const FCMRepository = require('@repositories/fcmRepository');
const fcmRepository = new FCMRepository();
const FirestoreAPI = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreAPI();
const FCMToken = require('@models/token');

router.post('/addToken', async (req, res) => {
    const {
        userId: userId,
        token: token
    } = req.body;

    if(!userId || !token) {
        const serverResponse = {
            message: "Error to add fcm token",
            error: `
            Some missing fields : 
            {
                userId: ${userId},
                token: ${token}
            }
            `
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const fcmToken = new FCMToken(userId, token);
    fcmRepository.upsertToken(fcmToken, FCMToken.fileName())
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

router.post('/sendNotification', async (req, res) => {
    const { recipientId, data } = req.body;

    if (!recipientId || !data) {
        const serverResponse = {
            message: "Error to send notification",
            error: `
            Some missing fields : 
            {
                recipientId: ${recipientId},
                data: ${data}
            }
            `
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const fcmToken = await fcmRepository.getTokenValue(recipientId);
    const notificationMessage = {
        notification: {
            title: "New Message",
            body: "You have a new message !",
        },
        data: JSON.stringify(data),
        token: fcmToken
    };

    firestoreAPI.sendNotification(notificationMessage)
        .then(_ => {
            const serverResponse = {
                message: 'Notification sent successfully',
            };

            res.status(201).json(serverResponse);
        })
        .catch((error) => {
            const serverResponse = {
                message: 'Error sending notification',
                error: error.message
            };

            log.error(serverResponse.message, error);
            res.status(500).json(serverResponse)
        })
})

module.exports = router;