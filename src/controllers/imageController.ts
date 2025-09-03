import { e } from '@utils/logs';
import { Readable } from 'stream';
import { ImageRepository } from '@repositories/imageRepository';
import type { Request, Response } from "express";
import { getErrorOrDefault } from "@utils/exceptionUtils.ts";

const imageRepository = new ImageRepository();

export const downloadImage = async (req: Request, res: Response) => {
    const objectName = req.params.filename;

    if(!objectName) {
        const serverResponse = {
            message: `Error to download image`,
            error: 'Missing image name'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        const { contentType, value } = await imageRepository.downloadImage(objectName);
        if (!(value instanceof ReadableStream)) {
            throw new Error('Invalid stream value');
        }

        res.set('Content-Type', contentType);
        return Readable.fromWeb(value).pipe(res);
    }
    catch (err) {
        const error = getErrorOrDefault(err);
        const serverResponse = {
            message: `Error downloading image ${objectName}`,
            error: error.message
        };

        e(serverResponse.message, error);
        return res.status(500).json(serverResponse);
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const imageFile = req.file;

    if(!imageFile) {
        const serverResponse = {
            message: `Error to upload image`,
            error: 'No image file found'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await imageRepository.uploadImage(imageFile.path, imageFile.originalname);
        const serverResponse = {
            message: `Image uploaded successfully`
        };

        return res.status(200).json(serverResponse);
    }
    catch (err) {
        const error = getErrorOrDefault(err);
        const serverResponse = {
            message: `Error uploading image ${imageFile.originalname}`,
            error: error.message
        };

        e(serverResponse.message, error);
        return res.status(500).json(serverResponse)
    }
}

export const deleteImage = async (req: Request, res: Response) => {
    const objectName = req.params.filename;

    if(!objectName) {
        const serverResponse = {
            message: `Error to delete image`,
            error: 'Missing image name'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        return res.status(400).json(serverResponse);
    }

    try {
        await imageRepository.deleteImage(objectName);
        const serverResponse = {
            message: `Image deleted successfully`
        };

        return res.status(200).json(serverResponse);
    }
    catch (err) {
        const error = getErrorOrDefault(err);
        const serverResponse = {
            message: `Error deleting image ${objectName}`,
            error: error.message
        };

        e(serverResponse.message, error);
        return res.status(500).json(serverResponse);
    }
}

export default {
    downloadImage,
    uploadImage,
    deleteImage
}