import Post from '../models/post.model.js';

export const newPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next({ statusCode: 403, message: 'You are not authorized to create a post' });
    }

    if (!req.body.title || !req.body.content) {
        return next({ statusCode: 400, message: 'Title and content are required' });
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, '');

    const post = new Post({ 
        ...req.body,
        slug,
        userId: req.user.userId
    });

    try {
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}