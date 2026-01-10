import type {ServerResponse} from '@models/serverResponse';
import {ErrorCode} from "@data/error/errorCodes";

export const badRequestErrorResponse = (
    message: string = 'Some fields are missing',
    code?: string
): ServerResponse => {
    return {
        error: 'Bad Request',
        code: code,
        message: message
    };
};

export const unauthorizedErrorResponse = (
    message: string = 'Empty or invalid token',
    code: string = ErrorCode.EMPTY_OR_INVALID_TOKEN
): ServerResponse => {
    return {
        error: 'Unauthorized',
        code: code,
        message: message
    };
};

export const forbiddenErrorResponse = (
    message: string = 'You are not authorized to perform this action.',
    code: string = ErrorCode.ACCESS_DENIED
): ServerResponse => {
    return {
        error: 'Forbidden',
        code: code,
        message: message
    };
};

export const internalServerErrorResponse = (): ServerResponse => {
    return {
        error: 'Internal server error',
        message: 'An unexpected error occurred.'
    };
};

export const oracleErrorResponse = (error: any): ServerResponse => {
    const oracleCodeMatch = error.message.match(/(ORA-\d{5})/);
    const oracleCode = oracleCodeMatch ? oracleCodeMatch[1] : 'UNKNOWN';

    return {
        error: 'Internal server error',
        code: oracleCode,
        message: 'An unexpected error occurred.'
    }
};