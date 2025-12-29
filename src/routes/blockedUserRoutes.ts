import express from "express";
import {verifyAuthIdToken} from "@middlewares/authMiddleware";
import * as blockedUserController from "@controllers/blockedUserController";
const router = express.Router();

router.get('/', verifyAuthIdToken, blockedUserController.getBlockedUsers);

router.post('/create', verifyAuthIdToken, blockedUserController.addBlockedUser);

router.delete('/:userId', verifyAuthIdToken, blockedUserController.removeBlockedUser);

export default router;