const fs = require('fs');
const os = require('os');
const path = require('path');
const homeDir = os.homedir();
const firestoreAPI = require('@data/firestoreAPI');

class CredentialsRepository {
    async upsertToken(token, tokenFileName) {
        firestoreAPI.upsertToken(token);
        const filePath = path.join(`${homeDir}/${token.userId}`, tokenFileName);
        fs.writeFileSync(filePath, token.value, 'utf8');
    }

    async getToken(userId, tokenFileName) {
        const filePath = path.join(`${homeDir}/${userId}`, tokenFileName);
        return fs.readFileSync(filePath, 'utf8');
    }
}

module.exports = CredentialsRepository;