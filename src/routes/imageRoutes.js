const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const imageController = require("@controllers/imageController")

router.get('/:filename', imageController.downloadImage);

router.post('/upload', upload.single('image'), imageController.uploadImage);

router.delete('/:filename', imageController.deleteImage);

module.exports = router;
