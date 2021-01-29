import { Request, Response } from 'express';

import { Post } from '../../models';
import { IPost } from '../../types';
import { decodeJWT, postData, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { postSuccess, postFailure } from '../../response';

const { 
    POST_CREATED_SUCCESS,
    POST_UPDATED_SUCCESS,
    POST_DELETED_SUCCESS,
    GET_SINGLE_POST_SUCESS,
    GET_ALL_POST_SUCCESS
} = postSuccess;    

const {
    POST_CREATED_FAIL,
    POST_UPDATED_FAIL,
    POST_DELETED_FAIL,
    GET_SINGLE_POST_FAIL,
    GET_ALL_POST_FAIL
} = postFailure;

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
        successResponseHandler(res, POST_CREATED_SUCCESS, '');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, POST_CREATED_FAIL, error.message);
    }
}

export const updatePost = async(req:Request, res:Response) => {
    try {
        const { locals: { param, data: { post, scope } } } = res;   
        let postObj: IPost = !scope ? postData({ post }) : postData({ post, scope });
        await Post.findOneAndUpdate(param, postObj);
        successResponseHandler(res, POST_UPDATED_SUCCESS, '');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, POST_UPDATED_FAIL, error.message);
    }
}

export const deletePost = async(req:Request, res:Response) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        successResponseHandler(res, POST_DELETED_SUCCESS, '');
    } catch(error){
        console.log(error.message);
        return errorResponseHandler(res, POST_DELETED_FAIL, error.message);
    }
}

export const getAllPosts = async(req:Request, res:Response) => {
    try {
        const { id } = decodeJWT(extractJWT(req));

        const posts = await Post.find({ from: id}).populate('comments reactions');
        successResponseHandler(res, GET_ALL_POST_SUCCESS, posts);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, GET_ALL_POST_FAIL, error.message);
    }
}

export const getPost = async(req: Request, res:Response) => {
    try {
        const { locals: { post } } = res;
        successResponseHandler(res, GET_SINGLE_POST_SUCESS, post);
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, GET_SINGLE_POST_FAIL, error.message);
    }
}