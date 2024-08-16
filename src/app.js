const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const userRoutes= require('./routes/userRoutes');
const imageRoutes= require('./routes/imageRoutes');
const announcementsRoutes= require('./routes/announcementsRoutes');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/image', imageRoutes);
app.use('/announcements', announcementsRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/index.html'));
});

app.listen(port, () => {
  console.log(`Web server started on http://89.168.52.45:${port}`);
});

