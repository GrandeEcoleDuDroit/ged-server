import express from 'express';
import multer from 'multer';
import * as imageController from '@controllers/imageController';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/:fileName', imageController.downloadImage);

router.post('/upload', upload.single('image'), imageController.uploadImage);

router.delete('/:fileName', imageController.deleteImage);

export default router;
