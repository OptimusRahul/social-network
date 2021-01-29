import { Request, Response } from 'express';

import { Post, Comment } from '../../models';
import { commentData, decodeJWT, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { commentFail, commentSuccess, authError } from '../../response';

const { UNAUTHORIZED_ERROR } = authError;
const { COMMENT_DOES_NOT_EXIST, COMMENT_CREATED_FAIL, COMMENT_DELETED_FAIL, COMMENT_UPDATED_FAIL } = commentFail;
const { COMMENT_CREATED_SUCCESS, COMMENT_UPDATED_SUCCESS, COMMENT_DELETED_SUCCESS } = commentSuccess;

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
        return successResponseHandler(res, COMMENT_CREATED_SUCCESS, comment);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, COMMENT_CREATED_FAIL, error.message, 304);
    }
}

// Update Comment
export const updateComment = async(req:Request, res:Response) => {
    const { body: { comment_id, body } } = req;
    try {
        const { id } = decodeJWT(extractJWT(req)); 
        const existingComment = await Comment.findById(comment_id);
        if(!existingComment) {
            return errorResponseHandler(res, COMMENT_DOES_NOT_EXIST, 404);
        }

        console.log(existingComment, id);

        if(existingComment.from.toString() !== id) {
            return errorResponseHandler(res, UNAUTHORIZED_ERROR, 401);
        }

        const commentObj = commentData({ body });
        existingComment.update(commentObj);
        return successResponseHandler(res, COMMENT_UPDATED_SUCCESS, existingComment, 204);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, COMMENT_UPDATED_FAIL, error.message, 304);
    }
}

// Delete Comment
export const deleteComment = async(req:Request, res: Response) => {
    const { body: { comment_id, post_id } }  = req;
    try { 
        const { id } = decodeJWT(extractJWT(req)); 

        const deleteComment = await Comment.findById(comment_id);
        if(!deleteComment) {
            return errorResponseHandler(res, COMMENT_DOES_NOT_EXIST, 404);
        }
        
        if(deleteComment.from.toString() !== id) {
            return errorResponseHandler(res, UNAUTHORIZED_ERROR, 401);
        }
        const exisitingPost = await Post.findById(post_id);

        const index: any = exisitingPost?.comments.findIndex((obj:any) => obj.commentID === comment_id);
        exisitingPost?.comments.splice(index, 1);
        await exisitingPost?.save();
        await deleteComment?.delete();

        return successResponseHandler(res, COMMENT_DELETED_SUCCESS, deleteComment, 204);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, COMMENT_DELETED_FAIL, error.message, 304);
    }
}