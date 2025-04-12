const fs = require('fs');
const os = require('os');
const path = require('path');
const FirestoreAPI = require('@data/api/firestoreAPI');
const firestoreAPI = new FirestoreAPI();
const homeDir = os.homedir();
const userDir = path.join(`${homeDir}`, 'gedoise-data', 'users');

class FcmRepository {
    async upsertToken(token, tokenFileName) {
        firestoreAPI.upsertToken(token);
        const dirPath = path.join(userDir, `${token.userId}`);
        const filePath = path.join(`${dirPath}`, tokenFileName);
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, token.value, 'utf8');
    }

    async getTokenValue(userId, tokenFileName) {
        const filePath = path.join(userDir, `${userId}`, tokenFileName);
        return fs.readFileSync(filePath, 'utf8');
    }
}

module.exports = FcmRepository;