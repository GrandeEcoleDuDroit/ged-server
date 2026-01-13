import { Request, Response } from 'express';
import { e } from '@utils/logs';
import MessageRepository from '@repositories/messageRepository';
import type { MessageReport } from '@models/messageReport';
import type {ServerResponse} from '@models/serverResponse';
import {
    badRequestErrorResponse,
    internalServerErrorResponse
} from "@utils/errorUtils";

const messageRepository = new MessageRepository();

export const reportMessage = async (req: Request, res: Response): Promise<void> => {
    const {
        conversationId: conversationId,
        messageId: messageId,
        recipient: recipient,
        reason: reason
    } = req.body;

    if (!conversationId || !messageId || !recipient || !reason) {
        res.status(400).json(badRequestErrorResponse);
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
        e(new Error(`Error reporting message ${messageId}: ${error.message}`));
        res.status(500).json(internalServerErrorResponse);
    }
};
