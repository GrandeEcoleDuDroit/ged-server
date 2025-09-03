import { OracleDatabaseConnection } from '@config/oracleDatabaseConnection';
import type { Connection } from 'oracledb';

const oracleDatabaseConnection = OracleDatabaseConnection.getInstance();

export class WhiteListRepository {
    async checkUserWhiteList(userEmail: string) {
        let connection: Connection | undefined;
        try {
            connection = await oracleDatabaseConnection.getConnection();

            const query = `SELECT COUNT(*) FROM USERS_WHITE_LIST WHERE USER_EMAIL = :user_email`;
            const binds = { user_email: userEmail };
            const result = await connection.execute(query, binds);
            const rows = result.rows as number[][];
            const count = rows?.[0]?.[0] ?? 0;

            return count > 0;
        } finally {
            if (connection) await connection.close(); // Rend au pool
        }
    }
}