const express = require('express');
const path = require('path');
const AnnouncementsRepository = require('./data/AnnouncementsRepository');
const app = express();
const port = 3000;
const announcementsRepository = new AnnouncementsRepository();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/announcements/get', async (req, res) => {
  await announcementsRepository.getAllAnnouncements(res);
})

// Initialize the database connection and start the server
  app.listen(port, () => {
    console.log(`Web server started on http://localhost:${port}`);
});

