import express from 'express';
import * as imageController from '@controllers/imageController';

const router = express.Router();

router.get('/:fileName', imageController.downloadImage);

router.post('/upload', imageController.uploadImage);

router.delete('/:fileName', imageController.deleteImage);

export default router;
