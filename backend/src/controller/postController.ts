import { Request, Response } from 'express';

import Posts from '../models/postModel';
import { errorResponseHandler, successResponseHandler } from '../utils';

// Create Post
export const createPost = async(req:Request, res:Response) => {
    const { body: { from, to, post, scope } } = req;
    try {
        const newPost = await Posts.create(req.body);
        successResponseHandler(res, 'Post created successfully');
    } catch(error) {
        console.log(error);

    }
}

export const updatePost = (req:Request, res:Response) => {
    const { body: { to, body, scope } } = req;
    try {

    } catch(error) {

    }
}

export const deletePost = (req:Request, res:Response) => {
    const { body: { id } } = req;
    try {

    } catch(error){

    }
}

export const getPost = (req: Request, res:Response) => {

}

// Add Reaction and Update Reaction
export const addReaction = async(req: Request, res: Response) => {
    const { locals: { post_id, from, reaction } } = res;
    try {
        const existingPost = await Posts.findById(post_id);

        if(!existingPost) {
            return errorResponseHandler(res, 'INVALID_POST');
        }

        const existingReaction = await Posts.findById(post_id).find({ reactions: { $in: from } });
        if(existingReaction.length > 0) {
            existingReaction[0].reactions = reaction;
        } else  {
            existingPost.reactions.push({ from, reactions: reaction });
        }
        await existingPost.save();
        // successResponseHandler(res, `You recently ${reaction} the ${}'s post`)
    } catch(error) {
        console.log(error);
    }
}

// Get Reaction
export const getPostReactions = (req: Request, res: Response) => {
    const { locals: { post_id } } = res;
    try {

    } catch(error) {

    }
}