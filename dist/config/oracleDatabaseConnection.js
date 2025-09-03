import oracledb, {} from 'oracledb';
import config from '../config.json' with { type: 'json' };
import { e } from '../utils/logs.ts';
const oraclePath = process.env.ORACLE_HOME;
export class OracleDatabaseConnection {
    constructor() {
        if (oraclePath) {
            oracledb.initOracleClient({ libDir: oraclePath });
        }
        else {
            const error = new Error("OracleDatabaseConnection constructor failed because ORACLE_HOME environment variable is not set");
            e('ORACLE_HOME environment variable is not set', error);
        }
    }
    static getInstance() {
        if (!OracleDatabaseConnection.instance) {
            OracleDatabaseConnection.instance = new OracleDatabaseConnection();
        }
        return OracleDatabaseConnection.instance;
    }
    async initPool() {
        if (OracleDatabaseConnection.pool) {
            return;
        }
        try {
            OracleDatabaseConnection.pool = await oracledb.createPool(config.dbConfig);
        }
        catch (err) {
            e('Failed to create Oracle connection pool:', err);
            throw err;
        }
    }
    async getConnection() {
        if (!OracleDatabaseConnection.pool) {
            await this.initPool();
        }
        try {
            return await OracleDatabaseConnection.pool.getConnection();
        }
        catch (err) {
            e('Error getting connection from pool:', err);
            throw err;
        }
    }
    async closePool() {
        if (OracleDatabaseConnection.pool) {
            try {
                await OracleDatabaseConnection.pool.close(10);
                OracleDatabaseConnection.pool = null;
            }
            catch (err) {
                e('Error closing Oracle connection pool:', err);
            }
        }
    }
}
OracleDatabaseConnection.instance = null;
OracleDatabaseConnection.pool = null;
