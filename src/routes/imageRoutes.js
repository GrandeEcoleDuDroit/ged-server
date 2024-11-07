const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const ImageRepository = require('../data/imageRepository');

const imageRepository = new ImageRepository();

router.post('/upload', upload.single('image'), async (req, res) => {
    const imageFile = req.file;
    const objectName = imageFile.originalname;

    try {
        if (!imageFile) {
            const serverResponse = { 
                message: `Error to upload image : ${objectName}`,
                error: 'No image file found'
            };

            return res.status(400).json(serverResponse);
        }

        await imageRepository.uploadImage(imageFile.path, objectName);
        const serverResponse = { 
            message: `Image uploaded successfully: ${objectName}` 
        };
        
        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = { 
            message: `Error uploading image ${objectName}`,
            error: error.message
        };

        res.status(500).json(serverResponse)
    }
});

router.get('/download/:filename', async (req, res) => {
    const objectName = req.params.filename;

    try {
        const response = await imageRepository.downloadImage(objectName);
        const contentType = response.contentType;
        res.set('Content-Type', contentType);

        const imageStream = new Readable.fromWeb(response.value);
        imageStream.pipe(res);
    }
    catch (error) {
        const serverResponse = {
            message: `Error downloading image ${objectName}`,
            error: error.message
        };

        res.status(500).json(serverResponse);
    }
});


router.delete('/:filename', async (req, res) => {
    const objectName = req.params.filename;

    try {
        await imageRepository.deleteImage(objectName);
        const serverResponse = { 
            message: `Image ${objectName} deleted successfully` 
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: `Error deleting image ${objectName}`,
            error: error.message
        };

        res.status(500).json(serverResponse);
    }
});

module.exports = router;
