const log = require('@utils/logsUtils');
const { Readable } = require('stream');
const ImageRepository = require('@repositories/imageRepository');

const imageRepository = new ImageRepository();

const downloadImage = async (req, res) => {
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

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

const uploadImage = async (req, res) => {
    const imageFile = req.file;
    const objectName = imageFile.originalname;

    try {
        if (!imageFile) {
            const serverResponse = {
                message: `Error to upload image : ${objectName}`,
                error: 'No image file found'
            };

            log.error(serverResponse.message, new Error(serverResponse.error));
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

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
}

const deleteImage = async (req, res) => {
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

        log.error(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

module.exports = {
    downloadImage,
    uploadImage,
    deleteImage
}