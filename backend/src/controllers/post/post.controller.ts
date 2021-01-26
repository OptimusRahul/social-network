import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { Post } from '../../models';
import { decodeJWT, postData, reactionData, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { IPost } from '../../types';

// Create Post
export const createPost = async(req:Request, res:Response) => {
    try {
        const { id } = decodeJWT(extractJWT(req));
        const { to, post, scope } = req.body;
        let postObj: IPost;
        if(!to) {
            postObj = postData({ from: id, post, scope });
        } else {
            postObj = postData({ to, from:id, post, scope });
        }


        await Post.create(postObj);
        successResponseHandler(res, 'Post created successfully');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const updatePost = async(req:Request, res:Response) => {
    try {
        const { locals: { param, data: { post, scope } } } = res;   
        let postObj: IPost = !scope ? postData({ post }) : postData({ post, scope });
        await Post.findOneAndUpdate(param, postObj);
        successResponseHandler(res, 'Post Updated Successfully');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const deletePost = async(req:Request, res:Response) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        successResponseHandler(res, 'Post deleted successfully');
    } catch(error){
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const getAllPosts = async(req:Request, res:Response) => {
    try {
        const { id } = decodeJWT(extractJWT(req));

        const posts = await Post.find({ from: id}).populate('comments reactions');
        successResponseHandler(res, posts);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

export const getPost = async(req: Request, res:Response) => {
    try {
        const { locals: { post } } = res;
        successResponseHandler(res, post);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

// Get Reaction
export const getPostReactions = (req: Request, res: Response) => {
    const { locals: { post_id } } = res;
    try {

    } catch(error) {

    }
}