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