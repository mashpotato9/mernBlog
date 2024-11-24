import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', verifyUser, getUsers);
router.put('/:id', verifyUser, updateUser);
router.delete('/:id', verifyUser, deleteUser);

export default router;