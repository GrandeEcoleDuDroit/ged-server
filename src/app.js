require('module-alias/register');
require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const userRoutes = require('@routes/userRoutes');
const imageRoutes = require('@routes/imageRoutes');
const announcementsRoutes = require('@routes/announcementsRoutes');

const app = express();
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/image', imageRoutes);
app.use('/announcements', announcementsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui/index.html'));
});

https.createServer(options, app).listen(3000, () => {
  console.log(`Web server started !`);
});
