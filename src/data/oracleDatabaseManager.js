const oracledb= require('oracledb');
const config = require('../../config.json');

class OracleDatabaseManager {
    #oracleConnection

    constructor() {
        if(OracleDatabaseManager.instance){
            return OracleDatabaseManager.instance;
        }

        oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_23_4' });
        OracleDatabaseManager.instance = this;
    }

    async #connect(){
        try {
            console.log('Initializing database connection...');
            let connection = await oracledb.getConnection(config.dbConfig);
            console.log('Database connection established !');
            return connection;
        }
        catch (err) {
            console.error('Failed to connect to the database:', err);
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

module.exports = OracleDatabaseManager;