import { OracleDatabaseConnection } from '@config/oracleDatabaseConnection';
import { FirebaseManager } from '@config/firebaseManager';

export const oracleDatabaseConnection = OracleDatabaseConnection.getInstance();
export const firebaseManager = FirebaseManager.getInstance();