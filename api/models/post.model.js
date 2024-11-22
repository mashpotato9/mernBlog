import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: 'https://revenuearchitects.com/wp-content/uploads/2017/02/Blog_pic-1030x584.png',
    },
    category: {
        type: String,
        default: 'Uncategorized',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },

}, { timestamps: true });

const Post = mongoose.model('Post', userSchema);

export default Post;