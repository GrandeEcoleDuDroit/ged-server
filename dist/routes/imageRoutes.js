import express from 'express';
import multer from 'multer';
import imageController from "../controllers/imageController.ts";
const upload = multer({ dest: 'uploads/' });
export const router = express.Router();
router.get('/:filename', imageController.downloadImage);
router.post('/upload', upload.single('image'), imageController.uploadImage);
router.delete('/:filename', imageController.deleteImage);
export default router;
