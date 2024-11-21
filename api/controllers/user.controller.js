import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({ message: 'Hello World' });
}

export const updateUser = async (req, res, next) => {
    if (req.user.userId !== req.params.id) {
        return next(errorHandler(403, 'Unauthorized to update user'));
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    if (req.body.username) {
        if (req.body.username === '') {
            return next(errorHandler(400, 'Username cannot be empty'));
        }
        if (req.body.username.length > 20 || req.body.username.length < 5) {
            return next(errorHandler(400, 'Username must be between 5 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username.match(/[^a-zA-Z0-9]/)) {
            return next(errorHandler(400, 'Username can only contain letters and numbers'));
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                }
            }, { new: true });
        const { password, ...info } = updateUser._doc;
        res.status(200).json(info);
    } catch (error) {
        next(error);
    }
};