import { OracleDatabaseConnection } from './oracleDatabaseConnection.ts';
import { FirebaseManager } from './firebaseManager.ts';
export const oracleDatabaseConnection = OracleDatabaseConnection.getInstance();
export const firebaseManager = await FirebaseManager.getInstance();
