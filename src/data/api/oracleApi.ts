import { BindParameters, ExecuteOptions, Pool } from 'oracledb';
import oracledb from 'oracledb';
import config from '@root/config.json';
import { e } from '@utils/logs';

oracledb.initOracleClient({ libDir: process.env.ORACLE_HOME });

export default class OracleApi {
    private _pool: Pool | null = null;
    private static _instance: OracleApi;

    private constructor() {}

    public static get instance(): OracleApi {
        return this._instance || (this._instance = new this());
    }

    private async pool(): Promise<Pool> {
        if (!this._pool) {
            const pool = await oracledb.createPool(config.dbConfig);
            this._pool = pool;
            return pool;
        } else {
            return this._pool;
        }
    }

    async execute(sql: string, params: BindParameters = [], options: ExecuteOptions = {}) {
        let connection;
        try {
            connection = await (await this.pool()).getConnection();
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

    async executeMany(sql: string, params: BindParameters[] = [], options: ExecuteOptions = {}) {
        let connection;
        try {
            connection = await (await this.pool()).getConnection();
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
        if (this._pool) {
            try {
                await this._pool.close(10);
                this._pool = null;
            } catch (err) {
                e('Error closing Oracle connection _pool:', err);
            }
        }
    }
}