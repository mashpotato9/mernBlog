import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';


export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to view users'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 6;
        const sortBy = req.query.order === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortBy })
            .skip(startIndex)
            .limit(limit);
        
        const userNoPassword = users.map(user => {
            const { password, ...info } = user._doc;
            return info;
        })

        const totalUsers =  await User.countDocuments();

        const now = new Date();
        const lastMonth  = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const newUsers = await User.countDocuments({ createdAt: { $gte: lastMonth } });

        res.status(200).json({ users: userNoPassword, totalUsers, newUsers });

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (error) {
        next(error);
    }
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

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.userId !== req.params.id) {
        return next(errorHandler(403, 'Unauthorized to update user'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully'});
    } catch (error) {
        next(error);
    }
}