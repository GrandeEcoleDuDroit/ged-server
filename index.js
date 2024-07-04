const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Web server started on http://localhost:${port}`);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_19_23' });

async function connection() {
  try {
    console.log('Initializing database connection...');
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Oracle database connection sucessful !');
    await connection.close();
    console.log('Database connection closed.');
  } 
  catch (err) {
    console.error('Error to get oracle database connection:', err);
  }
}

connection()