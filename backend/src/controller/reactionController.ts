import { Request, Response } from 'express';

import Post from '../models/postModel';
import Reaction from '../models/reactionModel';
import { successResponseHandler } from '../utils';

export const reactionOperation = async(req:Request, res:Response) => {
    const { post_id, from, type } = req.body;
    try {
        const existingReaction = await Reaction.findOne({ post_id, from });
        const exisitingPost = await Post.findById(post_id);
        
        if(!existingReaction) {
            const reactionObj: any = { from, post_id, type };
            const newReaction = await Reaction.create(reactionObj);
            
            exisitingPost?.reactions.push({ reactionId: newReaction._id })
            await exisitingPost?.save();
            
            return successResponseHandler(res, `You ${type} the post`);
        }

        if(existingReaction.type !== type) {
            existingReaction.type = type;
            await existingReaction.save();
            return successResponseHandler(res, `You ${type} the post`);
        }

        const index: any = exisitingPost?.reactions.findIndex((obj:any) => obj.reactionId === existingReaction._id)
        exisitingPost?.reactions.splice(index, 1);
        await exisitingPost?.save();
        await existingReaction.delete();
        return successResponseHandler(res, 'Reaction deleted');


    } catch(error) {
        console.log(error);
    }
}