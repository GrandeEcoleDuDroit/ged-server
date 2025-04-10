const fs = require('fs');
const os = require('os');
const path = require('path');
const homeDir = os.homedir();
const FirestoreAPI = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreAPI();

class CredentialsRepository {
    async upsertToken(token, tokenFileName) {
        firestoreAPI.upsertToken(token);
        const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users', `${token.userId}`);
        const filePath = path.join(userDir, tokenFileName);
        
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        fs.writeFileSync(filePath, token.value, 'utf8');
    }

    async getToken(userId, tokenFileName) {
        const filePath = path.join(`${homeDir}/${userId}`, tokenFileName);
        return fs.readFileSync(filePath, 'utf8');
    }
}

module.exports = CredentialsRepository;