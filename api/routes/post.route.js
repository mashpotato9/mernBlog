import express from 'express';
import { newPost, getPosts, deletePost, updatePost } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/', verifyUser, newPost);
router.get('/', getPosts);
router.delete('/:postId', verifyUser, deletePost);
router.put('/:postId', verifyUser, updatePost);

export default router;