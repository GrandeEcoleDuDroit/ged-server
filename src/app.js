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
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './ui/index.html'));
});

app.get('/announcements/get', async (req, res) => {
  try {
    const result = await announcementsRepository.getAllAnnouncements();
    res.json(result);
  }
  catch (error) {
    console.error('Error get all announcements:', error);
    res.status(500).json(`Failed to execute getAllAnnouncements query: ${error.message}`);
  }
})

app.post('/users/create', async (req, res) => {
  const {
    USER_ID: id,
    USER_FIRST_NAME: firstName,
    USER_LAST_NAME: lastName,
    USER_EMAIL: email,
    USER_SCHOOL_LEVEL: schoolLevel,
    USER_IS_MEMBER: isMember,
    USER_PROFILE_PICTURE_URL: profilePictureUrl
  } = req.body

  if (!firstName || !lastName || !email || !schoolLevel) {
    const errorMessage = {
      message: "Error to create user",
      error: `
          All user fields are required :
          {
            firstName: ${firstName},
            lastName: ${lastName},
            email: ${email},
            schoolLevel: ${schoolLevel},
            firstname: ${firstName},
          }`
    }
    return res.status(400).json(errorMessage);
  }

  try {
    const user = new User(id, firstName, lastName, email, schoolLevel, isMember, profilePictureUrl);
    const result = await userRepository.createUser(user);
    const userId = result.outBinds.user_id[0];

    const serverResponse = {
      message: `User ${user.firstName} ${user.lastName} created successfully.`,
      data : userId
    }

    res.status(201).json(serverResponse);
    console.log(`User ${user.firstName} ${user.lastName} create successfully with ID ${userId}`);
  }
  catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json(`Error inserting user ${error.message}`);
  }
});

app.post('/users/update/profile-picture-url', async(req, res) => {
  console.log('Update profile picture url request received');
  const profilePictureUrl = req.body.USER_PROFILE_PICTURE_URL;
  const userId = req.body.USER_ID;

  if(!profilePictureUrl && !userId){
    const errorMessage = {
      message: "Error to update profile picture url",
      error: `Missing fields : 
          { 
            profilePictureUrl: ${profilePictureUrl},
            userId: ${userId}
          }`
    }
    console.log(`Error to update profile picture url: profilePictureUrl: ${profilePictureUrl}, userId: ${userId}`);
    return res.status(400).json(errorMessage);
  }

  try {
    await userRepository.updateProfilePictureUrl(profilePictureUrl, userId);
    const serverResponse = {
      message: `Profile picture url updated successfully`
    };
    console.log('Profile picture url updated successfully')
    res.status(201).json(serverResponse);
  }
  catch (error) {
    const errorMessage = {
      message: 'Error update profile picture url',
      error: error.message
    }
    console.error(errorMessage.message, error);
    res.status(500).json(errorMessage);
  }
});

app.delete('/users/profile-picture-url/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    await userRepository.deleteProfilePictureUrl(userId)
    const serverResponse = {
      message: `Profile picture url deleted successfully`
    };
    console.log('Profile picture url deleted successfully')
    res.status(201).json(serverResponse);
  }
  catch (error) {
    const errorMessage = {
      message: 'Error delete profile picture url',
      error: error.message
    }
    console.error(errorMessage.message, error);
    res.status(500).json(errorMessage);
  }
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
    const errorMessage = {
        message: `Error downloading image ${objectName}`,
        error: err.message
  }
    console.error(`${errorMessage.message}: ${errorMessage.error}`);
    res.status(500).json(errorMessage);
  }
});

app.delete('/image/:filename', async (req, res) => {
  console.log('Delete image request received');
  const objectName = req.params.filename;

  try {
    await imageRepository.deleteImage(objectName);
    const serverResponse = {
      message: `Image ${objectName} deleted sucessfully`
    };
    console.log(serverResponse.message)
    res.json(serverResponse)
  }
  catch (error) {
    const serverResponse = {
      message: `Error deleting image ${objectName}`,
      error: error.message
    }
    console.error(serverResponse.message, error);
    res.status(500).json(serverResponse)
  }
});

app.post('/image/upload', upload.single('image'), async (req, res) => {
  const imageFile = req.file;
  const objectName = imageFile.originalname;

  try {
    if(!imageFile){
      return res.status(400).json('No image file found');
    }

    await imageRepository.uploadImage(imageFile.path, objectName);
    const serverResponse = {
      message: `Image uploaded successfully: ${objectName}`
    };

    res.json(serverResponse);
    console.log(serverResponse.message);
  }
  catch (error) {
    const serverResponse = {
      message: `Error uploading image ${objectName}`,
      error: error
    }
    res.status(500).json(serverResponse)
  }
});

// Initialize the database connection and start the server
  app.listen(port, () => {
    console.log(`Web server started on http://89.168.52.45:${port}`);
});

