const oracledb = require('oracledb');
const config = require('@root/config.json');
const log = require('@utils/logsUtils');
const oraclePath = process.env.ORACLE_HOME;

class OracleDatabaseConnection {
    #oracleConnection

    constructor() {
        if(OracleDatabaseConnection.instance){
            return OracleDatabaseConnection.instance;
        }

        oracledb.initOracleClient({ libDir: oraclePath });
        OracleDatabaseConnection.instance = this;
    }

    async #connect(){
        try {
            log.info('Initializing database connection...');
            let connection = await oracledb.getConnection(config.dbConfig);
            log.info('Database connection established !');
            return connection;
        }
        catch (err) {
            log.error('Failed to connect to the database:', err);
            log.info('Retrying to connect in 2 seconds...');
            setTimeout(this.#connect, 2000);
        }
    }

    async getConnection(){
        if(this.#oracleConnection == null){
            this.#oracleConnection = this.#connect()
            return this.#oracleConnection;
        }
        else {
            return this.#oracleConnection;
        }
    }
}

module.exports = OracleDatabaseConnection;
