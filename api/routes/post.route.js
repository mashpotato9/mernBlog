import express from 'express';
import { newPost, getPosts } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyUser, newPost);
router.get('/', getPosts);

export default router;