import express from 'express';
import { newComment, getComments, likeComment, editComment, deleteComment } from '../controllers/comment.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('', verifyUser, newComment);
router.get('/:postId', getComments);
router.put('/likeComment/:commentId', verifyUser, likeComment);
router.put('/editComment/:commentId', verifyUser, editComment);
router.delete('/:commentId', verifyUser, deleteComment);


export default router;