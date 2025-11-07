const oracledb = require('oracledb');
const config = require('@root/config.json');
const { e } = require('@utils/logs');
oracledb.initOracleClient({ libDir: process.env.ORACLE_HOME });

class OracleApi {
    #pool = null;

    constructor() {
        if (OracleApi.instance) {
            return OracleApi.instance;
        }

        OracleApi.instance = this;
    }

    async #initPool() {
        if (this.#pool) {
            return;
        }

        try {
            this.#pool = await oracledb.createPool(config.dbConfig);
        } catch (err) {
            e('Failed to create Oracle connection pool:', err);
            throw err;
        }
    }

    async execute(sql, params = [], options = {}) {
        let connection;
        try {
            if (!this.#pool) {
                await this.#initPool();
            }
            connection = await this.#pool.getConnection();
            return await connection.execute(sql, params, options);
        } catch (err) {
            e('Error execute oracle query:', err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    async executeMany(sql, params = [], options = {}) {
        let connection;
        try {
            if (!this.#pool) {
                await this.#initPool();
            }
            connection = await this.#pool.getConnection();
            return await connection.executeMany(sql, params, options);
        } catch (err) {
            e('Error execute many oracle query:', err);
            throw err;
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    async closePool() {
        if (this.#pool) {
            try {
                await this.#pool.close(10);
                this.#pool = null;
            } catch (err) {
                e('Error closing Oracle connection pool:', err);
            }
        }
    }
}

module.exports = new OracleApi();