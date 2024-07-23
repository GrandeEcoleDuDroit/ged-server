const oracledb= require('oracledb');

const dbConfig = {
    user: 'ADMIN',
    password: 'GEdoiseSch00L.!',
    connectString: `
      (DESCRIPTION=
        (retry_count=20)
        (retry_delay=3)
        (ADDRESS=
          (PROTOCOL=TCPS)
          (PORT=1522)
          (HOST=adb.eu-paris-1.oraclecloud.com)
        )
        (CONNECT_DATA=
          (SERVICE_NAME=gba7e8909100fd4_gedoisedatabase_high.adb.oraclecloud.com)
        )
        (SECURITY=(SSL_SERVER_DN_MATCH=YES))
      )
    `
};

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
            const connection = await oracledb.getConnection(dbConfig);
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
        }
        return this.#oracleConnection;
    }
}

module.exports = OracleDatabaseManager;