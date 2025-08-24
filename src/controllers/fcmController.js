import { e } from '#utils/logs.js';
import FcmRepository from '#repositories/fcmRepository.js';
import FCMToken from '#models/token.js';

const fcmRepository = new FcmRepository();

export const addToken = async (req, res) => {
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

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const fcmToken = new FCMToken(userId, token);
    fcmRepository.upsertToken(fcmToken)
        .then(_ => {
            const serverResponse = {
                message: 'Fcm token added successfully'
            };

            res.status(201).json(serverResponse);
        })
        .catch((error) => {
            const serverResponse = {
                message: 'Error adding fcm token',
                error: error.message
            };

            e(serverResponse.message, error);
            res.status(500).json(serverResponse)
        })
}

export const sendNotification = async (req, res) => {
    let {
        recipientId: recipientId,
        fcmMessage: fcmMessage
    } = req.body;

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

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = await fcmRepository.getTokenValue(recipientId);
        fcmMessage = JSON.parse(fcmMessage);
        const message = {
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.android.priority,
            },
            token: fcmToken
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

                e(serverResponse.message, error);
                res.status(500).json(serverResponse)
            })
    } catch (error) {
        const serverResponse = {
            message: 'Error sending notification',
            error: error.message
        }

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export default {
    addToken,
    sendNotification
}