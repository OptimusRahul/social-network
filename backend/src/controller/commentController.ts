import { Request, Response } from 'express';

import Post from '../models/postModel';
import Comment from '../models/commentModel';
import { commentData } from '../helpers';
import { successResponseHandler } from '../utils';


// Create Comment
export const createComment = async(req:Request, res:Response) => {
    const { body: { from, post_id, body, type } } = req;
    try {
        const commentObj = commentData({ from, postId: post_id, body, type });
        const comment = await Comment.create(commentObj);
        const post = await Post.findById(post_id);
        post?.commentId.push(comment._id);
        post?.save();
        successResponseHandler(res, comment);
    } catch(error) {
        console.log(error);
    }
}

// Update Comment
export const updateComment = async(req:Request, res:Response) => {
    const { body: { comment_id, body } } = req;
    try {
        const commentObj = commentData({ body });
        const comment = await Comment.findOneAndUpdate(comment_id, commentObj);
        successResponseHandler(res, comment);
    } catch(error) {

    }
}

// Delete Comment
export const deleteComment = async(req:Request, res: Response) => {
    const { body: { comment_id, post_id } }  = req;
    try { 
        console.log('delete comment');
        const deleteComment = await Comment.findByIdAndDelete(comment_id);
        console.log(deleteComment)
        const updatePost = await Post.findById(post_id);
        console.log(updatePost);
        if(updatePost?.commentId.includes(comment_id)) {
            const index = updatePost.commentId.indexOf(comment_id);
            updatePost.commentId.splice(index, 1);
            updatePost.save();
        }
        console.log(deleteComment, updatePost)
        successResponseHandler(res, updatePost)
    } catch(error) {

    }
}