import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { Post } from '../../models';
import { decodeJWT, postData, reactionData, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { IPost } from '../../types';

// Create Post
export const createPost = async(req:Request, res:Response) => {
    // const { locals: { id, data: { post, scope, to } } } = res;
    // console.log('=======>', id, to, post, scope);
    const { id } = decodeJWT(extractJWT(req));
    const { to, post, scope } = req.body;
    try {
        let postObj: IPost;
        if(!to) {
            postObj = postData({ from: id, post, scope });
        } else {
            postObj = postData({ to, from:id, post, scope });
        }


        const newPost = await Post.create(postObj);
        successResponseHandler(res, 'Post created successfully');
    } catch(error) {
        console.log(error);

    }
}

export const updatePost = async(req:Request, res:Response) => {
    const { locals: { param, data: { post, scope } } } = res;   
    try {
        let postObj: IPost = !scope ? postData({ post }) : postData({ post, scope });
        await Post.findOneAndUpdate(param, postObj);
        successResponseHandler(res, 'Post Updated Successfully');
    } catch(error) {
        console.log(error);
    }
}

export const deletePost = async(req:Request, res:Response) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);
        successResponseHandler(res, 'Post deleted successfully');
    } catch(error){
        console.log(error);
    }
}

export const getAllPosts = async(req:Request, res:Response) => {
    try {
        const { id } = decodeJWT(extractJWT(req));

        const posts = await Post.find({ from: id}).populate('comments reactions');
        successResponseHandler(res, posts);
    } catch(error) {
        console.log(error);
    }
}

export const getPost = async(req: Request, res:Response) => {
    const { locals: { post } } = res;
    successResponseHandler(res, post);
}

// Get Reaction
export const getPostReactions = (req: Request, res: Response) => {
    const { locals: { post_id } } = res;
    try {

    } catch(error) {

    }
}