import { Request, Response } from 'express';

import { Post, Comment } from '../../models';
import { commentData, decodeJWT, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';

// Create Comment
export const createComment = async(req:Request, res:Response) => {
    const { body: { post_id, body, type } } = req;
    try {
        let from = req.body.from;
        if(!from) {
            const { id }= decodeJWT(extractJWT(req));
            from = id;
        }
        const commentObj = commentData({ from, postId: post_id, body, type });
        const comment = await Comment.create(commentObj);
        const post = await Post.findById(post_id);
        post?.comments.push({ commentID: comment._id});
        post?.save();
        successResponseHandler(res, comment);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

// Update Comment
export const updateComment = async(req:Request, res:Response) => {
    const { body: { comment_id, body } } = req;
    try {
        const { id } = decodeJWT(extractJWT(req)); 
        const existingComment = await Comment.findById(comment_id);
        if(!existingComment) {
            return errorResponseHandler(res, 'Comment does not exist');
        }

        console.log(existingComment, id);

        if(existingComment.from.toString() !== id) {
            return errorResponseHandler(res, `You're not authorized to perform this operation`);
        }

        const commentObj = commentData({ body });
        existingComment.update(commentObj);
        successResponseHandler(res, 'Comment updated');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

// Delete Comment
export const deleteComment = async(req:Request, res: Response) => {
    const { body: { comment_id, post_id } }  = req;
    try { 
        const { id } = decodeJWT(extractJWT(req)); 

        const deleteComment = await Comment.findById(comment_id);
        if(!deleteComment) {
            return errorResponseHandler(res, 'Comment doesnot exists');
        }
        
        if(deleteComment.from.toString() !== id) {
            return errorResponseHandler(res, `You're not authorized to perform this operation`);
        }
        const exisitingPost = await Post.findById(post_id);

        const index: any = exisitingPost?.comments.findIndex((obj:any) => obj.commentID === comment_id);
        exisitingPost?.comments.splice(index, 1);
        await exisitingPost?.save();
        await deleteComment?.delete();

        // if(updatePost?.comments.includes(comment_id)) {
        //     const index = updatePost.commentId.indexOf(comment_id);
        //     updatePost.commentId.splice(index, 1);
        //     updatePost.save();
        // }
        successResponseHandler(res, exisitingPost);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}