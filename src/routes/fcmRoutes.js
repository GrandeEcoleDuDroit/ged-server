require('dotenv').config();
const express = require('express');
const router = express.Router();
const log = require('@utils/logsUtils');
const FCMRepository = require('@repositories/fcmRepository');
const fcmRepository = new FCMRepository();
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
    fcmRepository.upsertToken(fcmToken)
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
    let { fcmMessage } = req.body;
    fcmMessage = JSON.parse(fcmMessage);

    if (!fcmMessage) {
        const serverResponse = {
            message: "Error to send notification",
            error: `
            Missing field : 
            {
                fcmMessage: ${fcmMessage},
            }
            `
        };

        log.error(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = await fcmRepository.getTokenValue(fcmMessage.recipientId);
        const message = {
            token: fcmToken,
            notification: {
                title: fcmMessage.notification.title,
                body: fcmMessage.notification.body
            },
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.priority
            }
        };

        fcmRepository.sendNotification(message)
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
    } catch (error) {
        const serverResponse = {
            message: 'Error sending notification',
            error: error.message
        }

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
})

module.exports = router;