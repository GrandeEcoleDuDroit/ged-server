import { sendMail } from '@api/googleApi';
import type { MessageReport } from '@data/models/messageReport';

export default class MessageRepository {
    async reportMessage(report: MessageReport) {
        const subject = `Message report: ${report.messageId}`;
        const html = `
           <p>The message ${report.messageId} of conversation ${report.conversationId} has been reported</p>
           <p>Message author: ${report.recipientInfo.fullName} - <b>${report.recipientInfo.email}</b></p>
           <p>Reason: ${report.reason}</p>
         `;

        await sendMail(subject, html);
    }
}