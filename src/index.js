const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const app = express();
const port = 3000;
let oracleConnection;

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

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_19_23' });

async function connection() {
  try {
    console.log('Initializing database connection...');
    oracleConnection = await oracledb.getConnection(dbConfig);
    console.log('Oracle database connection successful!');
  } catch (err) {
    console.error('Error to get oracle database connection:', err);
  }
}

app.get('/announcements', async (req, res) => {
  try {
    if (!oracleConnection) {
      return res.status(500).json({ error: 'Database connection not established' });
    }
    const query = `
      SELECT JSON_OBJECT(*) 
      FROM announcements 
      NATURAL JOIN users
    `
    const resultRequest = await oracleConnection.execute(query);
    const announcements = resultRequest.rows.map(row => JSON.parse(row[0]));
    console.log("Result of query: ", announcements);
    res.json(announcements);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Failed to execute query' });
  }
});

// Initialize the database connection and start the server
connection().then(() => {
  app.listen(port, () => {
    console.log(`Web server started on http://localhost:${port}`);
  });
});

