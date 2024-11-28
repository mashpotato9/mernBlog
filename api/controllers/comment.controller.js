import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const newComment = async (req, res, next) => {
    try{
        const {content, postId, userId} = req.body;

        if(userId !== req.user.userId){
            return next(errorHandler(403, 'You are not authorized to comment on this post'));
        }
        
        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save();

        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const comments = await Comment.find({postId}).sort({createdAt: -1});

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const getAllComments = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not authorized to view all comments'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 6;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const comments = await Comment.find()
            .sort({createdAt: sortDirection})
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();
        
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const oneMonthComments = await Comment.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        });

        res.status(200).json({comments, totalComments, oneMonthComments});
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try{
        const commentId = req.params.commentId;    
        const userId = req.user.userId;

        const comment = await Comment.findById(commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(userId);
        if(userIndex === -1){
            comment.numberOfLikes++;
            comment.likes.push(userId);
        } else {
            comment.numberOfLikes--;
            comment.likes = comment.likes.filter(id => id !== userId);
        }

        await comment.save();
        res.status(200).json(comment);
        
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    try{
        const commentId = req.params.commentId;
        const {content} = req.body;

        const comment = await Comment.findById(commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found'));
        }

        if(comment.userId !== req.user.userId && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not authorized to edit this comment'));
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId, {content}, {new: true});
        res.status(200).json(updatedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if(!comment){
            return next(errorHandler(404, 'Comment not found'));
        }
        if(comment.userId !== req.user.userId && !req.user.isAdmin){
            return next(errorHandler(403, 'You are not authorized to delete this comment'));
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({message: 'Comment deleted successfully'});
    } catch (error) {
        next(error);
    }

}