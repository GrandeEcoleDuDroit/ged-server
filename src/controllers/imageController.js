import { e } from '#utils/logs.js';
import { Readable } from 'stream';
import ImageRepository from '#repositories/imageRepository.js';

const imageRepository = new ImageRepository();

export const downloadImage = async (req, res) => {
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

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export const uploadImage = async (req, res) => {
    const imageFile = req.file;
    const objectName = imageFile.originalname;

    try {
        if (!imageFile) {
            const serverResponse = {
                message: `Error to upload image : ${objectName}`,
                error: 'No image file found'
            };

            e(serverResponse.message, new Error(serverResponse.error));
            return res.status(400).json(serverResponse);
        }

        await imageRepository.uploadImage(imageFile.path, objectName);
        const serverResponse = {
            message: `Image uploaded successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: `Error uploading image ${objectName}`,
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse)
    }
}

export const deleteImage = async (req, res) => {
    const objectName = req.params.filename;

    try {
        await imageRepository.deleteImage(objectName);
        const serverResponse = {
            message: `Image deleted successfully`
        };

        res.status(200).json(serverResponse);
    }
    catch (error) {
        const serverResponse = {
            message: `Error deleting image ${objectName}`,
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
}

export default {
    downloadImage,
    uploadImage,
    deleteImage
}