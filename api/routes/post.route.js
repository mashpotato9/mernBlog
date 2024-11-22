import express from 'express';
import { newPost } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyUser, newPost);

export default router;