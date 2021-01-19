import { Request, Response } from 'express';

import mongoose from 'mongoose';
import Post from '../models/postModel';
import { postData, reactionData } from '../helpers';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { IPost } from '../types';

// Create Post
export const createPost = async(req:Request, res:Response) => {
    const { locals: { id, data: { post, scope, to } } } = res;
    // console.log('=======>', id, to, post, scope);
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
    const { locals: { param } } = res;
    try {
        await Post.findByIdAndDelete(param);
        successResponseHandler(res, 'Post deleted successfully');
    } catch(error){
        console.log(error);
    }
}

export const getPost = async(req: Request, res:Response) => {
    const { locals: { post } } = res;
    successResponseHandler(res, post);
}

// Add Reaction and Update Reaction
// export const addReaction = async(req: Request, res: Response) => {
//     let { locals: { post, param } } = res;
//     const { body: { from } } = req;
//     const newReaction = req.body.reaction;
//     try {
//         // const p = await Post.findById(param);
//         const existingPost = await Post.findById(param).find({ reactions: { $elemMatch: { from } } })
//         if(existingPost) {
//             const reaction = existingPost[0].reactions;
//             console.log(reaction[0].reaction);
//             if(reaction=== newReaction) {
//                 let x = await Post.findOneAndUpdate({}, { $pull: { from } })
//                 successResponseHandler(res, x);
//             } else {

//             }

//         }
//         // p?.reactions.push({ from, reaction });

//         // p?.save();

//         // successResponseHandler(res, p);

//     } catch(error) {
//         console.warn(error);
//     }
// }

// Get Reaction
export const getPostReactions = (req: Request, res: Response) => {
    const { locals: { post_id } } = res;
    try {

    } catch(error) {

    }
}