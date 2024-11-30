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

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 6;
        const sortBy = req.query.order === 'asc' ? 1 : -1;
        const query = {
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),
        };

        const posts = await Post.find(query)
            .sort({ createdAt: sortBy })
            .skip(startIndex)
            .limit(limit);
        
        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        );
        const oneMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({ posts, totalPosts, oneMonthPosts });
        

    } catch (error) {
        next(error);
    }
}



export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next({ statusCode: 404, message: 'Post not found' });
        }

        if (!req.user.isAdmin && post.userId.toString() !== req.user.userId) {
            return next({ statusCode: 403, message: 'You are not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next({ statusCode: 404, message: 'Post not found' });
        }

        if (!req.user.isAdmin && post.userId.toString() !== req.user.userId) {
            return next({ statusCode: 403, message: 'You are not authorized to update this post' });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
            { $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            }}, { new: true })
        
        res.status(200).json(updatedPost);

    } catch (error) {
        next(error);
    }
}