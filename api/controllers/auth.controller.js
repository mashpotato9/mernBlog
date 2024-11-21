import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

export const login = async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password || username === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return next(errorHandler(400, 'Invalid credentials'));
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
        )

        const { password: userPassword, ...userInfo } = user._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 3600000
        }).json(userInfo);
    } catch (error) {
        next(error);
    }
}

export const googleLogin = async (req, res, next) => {
    const { name, email, photo } = req.body;
    try{
        const user = await User.findOne({ email });
        if(user){
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )
            const { password: userPassword, ...userInfo } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 3600000
            }).json(userInfo);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 12);
            const newUser = new User({ 
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email, 
                password: hashedPassword, 
                profilePicture: photo 
            });
            await newUser.save();
            const token = jwt.sign(
                { userId: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )
            const { password: userPassword, ...userInfo } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'None',
                //secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            }).json(userInfo);
        }
    } catch (error) {
        next(error);
    }
}

export const logout = (req, res) => {
    try{
        res.clearCookie('access_token').status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
}