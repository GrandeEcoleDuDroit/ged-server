const { e } = require('@utils/logs');
const FcmRepository = require('@repositories/fcmRepository');
const fcmRepository = new FcmRepository();
const FCMToken = require('@models/token');

const addToken = async (req, res) => {
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

    try {
        await fcmRepository.upsertToken(fcmToken)
        const serverResponse = {
            message: 'Fcm token added successfully'
        };

        res.status(201).json(serverResponse);

    } catch (error) {
        const serverResponse = {
            message: 'Error adding fcm token',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
}

const sendNotification = async (req, res) => {
    const {
        recipientId: recipientId,
        notificationGroupId: notificationGroupId
    } = req.body;
    let { fcmMessage: fcmMessageJson } = req.body;

    if (!fcmMessageJson) {
        const serverResponse = {
            message: "Error to send notification",
            error: `
            Missing field : 
            {
                fcmMessage: ${fcmMessageJson},
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const fcmToken = await fcmRepository.getTokenValue(recipientId);
        let fcmMessage = JSON.parse(fcmMessageJson);

        const message = {
            data: {
                type: fcmMessage.data.type,
                value: JSON.stringify(fcmMessage.data.value)
            },
            android: {
                priority: fcmMessage.android.priority,
            },
            apns : {
                headers: {
                    "apns-priority": fcmMessage.apns.headers.apnsPriority,
                    "apns-collapse-id": fcmMessage.apns.headers.apnsCollapseId
                },
                payload: {
                    aps: {
                        alert : {
                            title: fcmMessage.apns.payload.aps.alert.title,
                            body: fcmMessage.apns.payload.aps.alert.body
                        },
                        sound: fcmMessage.apns.payload.aps.sound,
                        badge: fcmMessage.apns.payload.aps.badge,
                    }
                }
            },
            token: fcmToken
        };

        await fcmRepository.sendNotification(message, recipientId, notificationGroupId);
        const serverResponse = {
            message: 'Notification sent successfully'
        };
        res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = {
            message: 'Error sending notification',
            error: error.message
        }

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const removeNotification = async (req, res) => {
    const {
        userId: userId,
        notificationGroupId: notificationGroupId
    } = req.body;

    if (!userId || !notificationGroupId) {
        const serverResponse = {
            message: "Error to remove notification",
            error: `
            Some missing fields : 
            {
                userId: ${userId},
                notificationGroupId: ${notificationGroupId}
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await fcmRepository.removeNotification(userId, notificationGroupId);
        const serverResponse = {
            message: 'Notification removed successfully'
        };
        res.status(201).json(serverResponse);
    } catch (error) {
        const serverResponse = {
            message: 'Error removing notification',
            error: error.message
        }

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    addToken,
    sendNotification,
    removeNotification
}