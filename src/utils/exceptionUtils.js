export const formatOracleError = function (error, message) {
    const oraCodeMatch = error.message.match(/(ORA-\d{5})/);
    const oraCode = oraCodeMatch ? oraCodeMatch[1] : 'UNKNOWN';

    return {
        message: message,
        code: oraCode,
        error: error.message
    };
}

export default formatOracleError;