import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new User({ username, email, password: hashedPassword });

    try{
        await newUser.save();
        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}