export const formatOracleError = function (error: Error, message: string) {
    const oraCodeMatch = error.message.match(/(ORA-\d{5})/);
    const oraCode = oraCodeMatch ? oraCodeMatch[1] : 'UNKNOWN';

    return {
        message: message,
        code: oraCode,
        error: error.message
    };
}

export const getErrorOrDefault = function (error: unknown) {
    return error instanceof Error ? error : new Error('Unknown error');
}