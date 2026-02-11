import type { Request, Response } from 'express';
import PostRepository from '@repositories/postRepository';
import {
    oracleErrorResponse,
    badRequestErrorResponse
} from '@utils/errorUtils';
import type {ServerResponse} from '@models/serverResponse';
import Post from '@models/post';
import {e} from '@utils/logs';
import ImageRepository from "@repositories/imageRepository";
import {Readable} from "stream";

const postRepository = new PostRepository();
const imageRepository = new ImageRepository();

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const testPost = req.claims?.tester ?? false;
    const postJson = req.body.post;
    const {
        POST_ID: id,
        POST_TITLE: title,
        POST_CONTENT: content,
        POST_LINK: link,
        POST_SOURCE_ID: sourceId,
        POST_DATE: date,
        POST_IMAGE_FILE_NAMES: imageFileNames,
    } = JSON.parse(postJson);

    if (
        !id ||
        !title ||
        !content ||
        !link ||
        !sourceId ||
        !date ||
        !imageFileNames
    ) {
        res.status(400).json(badRequestErrorResponse);
        return;
    }

    const post: Post = {
        id: id,
        title: title,
        content: content,
        link: link,
        sourceId: sourceId,
        date: date,
        imageFileNames: imageFileNames,
        test: testPost
    };

    try {
        await postRepository.createPost(post);
        const files = Array.isArray(req.files) ? req.files : [];
        for (const file of files) {
            await imageRepository.uploadImage(
                Readable.from(file.buffer),
                getImagePath(file.originalname),
                file.size
            );
        }
        const serverResponse: ServerResponse = { message: 'Post created successfully' };
        res.status(201).json(serverResponse);
    } catch (error: any) {
        e(new Error(`Error creating post: ${error.message}`));
        res.status(500).json(oracleErrorResponse(error));
    }
}

function getImagePath(fileName: string): string {
    return `PostImages/${fileName}`;
}