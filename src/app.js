const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const AnnouncementsRepository = require('./data/announcementsRepository');
const ImageRepository = require("./data/imageRepository");

const app = express();
const port = 3000;
const announcementsRepository = new AnnouncementsRepository();
const imageRepository = new ImageRepository();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/index.html'));
});

app.get('/announcements/get', async (req, res) => {
  await announcementsRepository.getAllAnnouncements(res);
})

app.get('/image/download/:filename', async (req, res) => {
  const objectName = req.params.filename;
  
  try {
    const imageStream = await imageRepository.downloadImage(objectName)
    imageStream.pipe(res)
  }
  catch (err) {
    console.error(`Error downloading image ${objectName}: ${err.message}`);
    res.status(500).send(`Error download image ${objectName}: ${err.message}`)
  }
})

app.post('/image/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file
  const objectName = imageFile.originalname

  try {
    if(!imageFile){
      return res.status(400).send('No image file found')
    }

    const response = await imageRepository.uploadImage(imageFile.path, objectName)
    console.log(`Image uploaded successfully: ${objectName}`);
    res.send(response)
  }
  catch (err) {
    res.status(500).send(`Error uploading image ${objectName}: ${err}`)
  }
})


imageRepository.listObjects()

// Initialize the database connection and start the server
  app.listen(port, () => {
    console.log(`Web server started on http://89.168.52.45/:${port}`);
});

