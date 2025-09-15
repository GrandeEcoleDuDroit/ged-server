const { e } = require('@utils/logs');
const MessageRepository = require('@repositories/messageRepository');
const MessageReport = require("@models/messageReport");

const messageRepository = new MessageRepository();

const reportMessage = async (req, res) => {
    const {
        conversationId: conversationId,
        messageId: messageId,
        recipientInfo: recipientInfo,
        reason: reason
    } = req.body;

    if (!conversationId || !messageId || !recipientInfo || !reason) {
        const serverResponse = {
            message: "Error to report message",
            error: `
            Some missing report fields :
            {
                conversationId: ${conversationId},
                messageId: ${messageId},
                recipientInfo: ${recipientInfo},
                reason: ${reason},
            }
            `
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    const report = new MessageReport(conversationId, messageId, recipientInfo, reason);

    try {
        await messageRepository.reportMessage(report);
        const serverResponse = {
            message: `Message ${messageId} of ${recipientInfo.fullName} has been reported successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error) {
        const serverResponse = {
            message: 'Error reporting message',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    reportMessage
}