import type {ServerResponse} from '@models/serverResponse';

export const formatOracleError = function(message: string, error: any) {
    const oracleCodeMatch = error.message.match(/(ORA-\d{5})/);
    const oracleCode = oracleCodeMatch ? oracleCodeMatch[1] : 'UNKNOWN ORACLE CODE';

    const serverResponse: ServerResponse = {
        message: message,
        code: oracleCode,
        error: error.message
    };
    return serverResponse;
};

export const missMatchTokenIdErrorMessage = (userId: string, tokenId?: string) => {
    return invalidFieldsErrorMessage('User id doesn\'t match with token id', { 'userId': userId , 'tokenId': tokenId })
};

export const invalidFieldsErrorMessage = (message: string | null | undefined, fields: any) => {
    return `${message ?? 'Invalid fields'}: \n${Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')}`;
}