const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { Readable } = require('stream');

const AnnouncementsRepository = require('./data/announcementsRepository');
const ImageRepository = require("./data/imageRepository");
const UserRepository = require("./data/userRepository");

const app = express();
const port = 3000;
const announcementsRepository = new AnnouncementsRepository();
const imageRepository = new ImageRepository();
const userRepository = new UserRepository();

const User = require("./data/model/user");

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/index.html'));
});

app.get('/announcements/get', async (req, res) => {
  await announcementsRepository.getAllAnnouncements(res);
})

app.post('/users/create', async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    email,
    schoolLevel,
    isMember
  } = req.body

  if (!firstName || !lastName || !email || !schoolLevel) {
    return res.status(400).send('All user fields are required');
  }

  const user = new User(id, firstName, lastName, email, schoolLevel);
  await userRepository.createUser(res, user);
});

app.get('/image/download/:filename', async (req, res) => {
  const objectName = req.params.filename;
  
  try {
    const response = await imageRepository.downloadImage(objectName);
    const contentType = response.contentType;
    res.set('Content-Type', contentType);

    const imageStream = new Readable.fromWeb(response.value);
    imageStream.pipe(res);
    console.log(`Image ${objectName} downloaded`);
  }
  catch (err) {
    console.error(`Error downloading image ${objectName}: ${err.message}`);
    res.status(500).send(`Error download image ${objectName}: ${err.message}`);
  }
})

app.post('/image/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  const objectName = imageFile.originalname;

  try {
    if(!imageFile){
      return res.status(400).send('No image file found');
    }

    const response = await imageRepository.uploadImage(imageFile.path, objectName);
    res.send(response);
    console.log(`Image uploaded successfully: ${objectName}`);
  }
  catch (error) {
    res.status(500).send(`Error uploading image ${objectName}: ${error}`)
  }
})

// Initialize the database connection and start the server
  app.listen(port, () => {
    console.log(`Web server started on http://89.168.52.45:${port}`);
});

