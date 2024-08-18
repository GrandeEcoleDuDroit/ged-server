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
            return res.status(400).json('No image file found');
        }

        await imageRepository.uploadImage(imageFile.path, objectName);
        res.status(200).json({ message: `Image uploaded successfully: ${objectName}` });
    }
    catch (error) {
        res.status(500).json({
            message: `Error uploading image ${objectName}`,
            error: error
        })
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
        res.status(500).json({
            message: `Error downloading image ${objectName}`,
            error: error.message
        });
    }
});


router.delete('/image/:filename', async (req, res) => {
    const objectName = req.params.filename;

    try {
        await imageRepository.deleteImage(objectName);
        res.status(200).json({ message: `Image ${objectName} deleted successfully` });
    }
    catch (error) {
        res.status(500).json({
            message: `Error deleting image ${objectName}`,
            error: error.message
        });
    }
});

module.exports = router;
