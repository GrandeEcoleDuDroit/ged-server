import { Request, Response } from 'express';
import { Readable } from 'stream';
import { e } from '@utils/logs';
import ImageRepository from '@repositories/imageRepository';

const imageRepository = new ImageRepository();

export const downloadImage = async (req: Request, res: Response) => {
    const objectName = req.params.path;

    try {
        const response = await imageRepository.downloadImage(objectName);
        res.set({
            "Content-Type": response.contentType ?? "application/octet-stream",
            "Content-Disposition": `attachment; filename="${objectName}"`,
            "Content-Length": response.contentLength ?? undefined,
            "Cache-Control": "no-store",
        });

        (response.value as Readable).pipe(res);
    } catch (error: any) {
        const serverResponse = {
            message: `Error downloading image ${objectName}`,
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const uploadImage = async (req: Request, res: Response) => {
    const imageFile = req.file;
    const imagePath = req.body.imagePath;

    if (!imageFile) {
        const serverResponse = {
            message: `Error uploading image`,
            error: 'No image file found'
        };

        e(serverResponse.message, new Error(serverResponse.error));
        res.status(400).json(serverResponse);
        return;
    }

    const fileStream = Readable.from(imageFile.buffer);

    try {
        await imageRepository.uploadImage(fileStream, imagePath, imageFile.size);
        const serverResponse = {
            message: `Image uploaded successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: `Error uploading image ${imageFile.originalname}`,
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};

export const deleteImage = async (req: Request, res: Response) => {
    const imagePath = req.body.imagePath;

    try {
        await imageRepository.deleteImage(imagePath);
        const serverResponse = {
            message: `Image deleted successfully`
        };

        res.status(200).json(serverResponse);
    } catch (error: any) {
        const serverResponse = {
            message: `Error deleting image ${imagePath}`,
            error: error.message
        };

        e(serverResponse.message, error);
        res.status(500).json(serverResponse);
    }
};
