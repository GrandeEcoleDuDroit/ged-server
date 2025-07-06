const OracleDatabaseConnection = require('@config/oracleDatabaseConnection');
const FirebaseManager = require('@config/firebaseManager');

const oracleDatabaseConnection = new OracleDatabaseConnection();
const firebaseManager = new FirebaseManager();

module.exports = {
    oracleDatabaseConnection,
    firebaseManager
};
