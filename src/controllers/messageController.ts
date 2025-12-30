import { Request, Response } from 'express';
import { e } from '@utils/logs';
import MessageRepository from '@repositories/messageRepository';
import type { MessageReport } from '@models/messageReport';
import type {ServerResponse} from '@models/serverResponse';
import {invalidFieldsErrorMessage} from "@utils/exceptionUtils";

const messageRepository = new MessageRepository();

export const reportMessage = async (req: Request, res: Response) => {
    const {
        conversationId: conversationId,
        messageId: messageId,
        recipient: recipient,
        reason: reason
    } = req.body;

    if (!conversationId || !messageId || !recipient || !reason) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting message',
            error: 'Missing fields'
        };

        e(serverResponse.message, new Error(invalidFieldsErrorMessage(serverResponse.error, req.body)));
        res.status(400).json(serverResponse);
        return;
    }

    const report: MessageReport = {
        conversationId: conversationId,
        messageId: messageId,
        recipient: recipient,
        reason: reason
    };

    try {
        await messageRepository.reportMessage(report);
        const serverResponse: ServerResponse = { message: 'Message has been reported successfully' };
        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse: ServerResponse = {
            message: 'Error reporting message',
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};
