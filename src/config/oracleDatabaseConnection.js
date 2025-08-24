import oracledb from 'oracledb';
import config from '#root/config.json' with { type: 'json' };
import { e } from '#utils/logs.js';

const oraclePath = process.env.ORACLE_HOME;

class OracleDatabaseConnection {
    static #pool = null;

    constructor() {
        if (OracleDatabaseConnection.instance) {
            return OracleDatabaseConnection.instance;
        }

        oracledb.initOracleClient({ libDir: oraclePath });
        OracleDatabaseConnection.instance = this;
    }

    async initPool() {
        if (OracleDatabaseConnection.#pool) {
            return;
        }

        try {
            OracleDatabaseConnection.#pool = await oracledb.createPool(config.dbConfig);
        } catch (err) {
            e('Failed to create Oracle connection pool:', err);
            throw err;
        }
    }

    async getConnection() {
        try {
            if (!OracleDatabaseConnection.#pool) {
                await this.initPool();
            }
            return await OracleDatabaseConnection.#pool.getConnection();
        } catch (err) {
            e('Error getting connection from pool:', err);
            throw err;
        }
    }

    async closePool() {
        if (OracleDatabaseConnection.#pool) {
            try {
                await OracleDatabaseConnection.#pool.close(10);
                OracleDatabaseConnection.#pool = null;
            } catch (err) {
                e('Error closing Oracle connection pool:', err);
            }
        }
    }
}

export default OracleDatabaseConnection;