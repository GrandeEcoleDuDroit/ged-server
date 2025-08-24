import OracleDatabaseConnection from '#config/oracleDatabaseConnection.js';
import FirebaseManager from '#config/firebaseManager.js';

export const oracleDatabaseConnection = new OracleDatabaseConnection();
export const firebaseManager = await FirebaseManager.getInstance();

export default {
    oracleDatabaseConnection,
    firebaseManager
};
