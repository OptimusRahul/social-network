import { Request, Response, NextFunction } from 'express';
import Posts from '../models/postModel';
import { errorResponseHandler } from '../utils';

export const postVerfification = async(req: Request, res: Response, next: NextFunction) => {
    const { body: { post_id } } = req;
    try {
        const existingPost = await Posts.findById(post_id);
        if(!existingPost){
            return errorResponseHandler(res, 'Post does not exist!!')
        }
    } catch(error) {

    }

    next();
}

export const reactionVerification = async(req: Request, res: Response, next: NextFunction) => {
    const { body: { post_id, user_id, reaction } } = req;

    try {
        const existingReaction = await Posts.findById(post_id).find({ reactions: { $in: user_id } })
        if(existingReaction.length <= 0){
            return errorResponseHandler(res, "You haven't reacted the post");
        }
    } catch(error) {
        
    }
    next();
}