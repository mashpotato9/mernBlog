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