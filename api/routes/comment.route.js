import express from 'express';
import { newComment, getComments, likeComment } from '../controllers/comment.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('', verifyUser, newComment);
router.get('/:postId', getComments);
router.put('/likeComment/:commentId', verifyUser, likeComment);

export default router;