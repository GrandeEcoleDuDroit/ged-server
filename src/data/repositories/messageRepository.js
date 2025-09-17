const { sendMail } = require('@data/api/googleApi');

class MessageRepository {
    async reportMessage(report) {
        const subject = `Report Message ${report.messageId}`;
        const html = `
           <p>The message ${report.messageId} of conversation ${report.conversationId} has been reported</p>
           <p>Message author : ${report.recipientInfo.fullName} - <b>${report.recipientInfo.email}</b></p>
           <p>Reason : ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}

module.exports = MessageRepository;
