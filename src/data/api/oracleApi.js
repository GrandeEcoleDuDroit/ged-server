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
        if (OracleApi.#pool) {
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
        try {
            if (!OracleApi.#pool) {
                await this.#initPool();
            }
            await this.#pool.execute(sql, params, options);
        } catch (err) {
            e('Error getting connection from pool:', err);
            throw err;
        } finally {
            await this.closePool();
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