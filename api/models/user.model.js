import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://www.eastendprep.org/wp-content/uploads/2016/06/noavatar-300x300.jpg',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;