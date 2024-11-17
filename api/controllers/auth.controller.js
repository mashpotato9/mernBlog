import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });

    try{
        await newUser.save();
        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
}