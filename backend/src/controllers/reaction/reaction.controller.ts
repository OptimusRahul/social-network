import { Request, Response } from 'express';

import { Post, Reaction } from '../../models';
import { createNotification } from '../';
import { successResponseHandler, errorResponseHandler } from '../../utils';
import { reactionSuccess, reactionFail } from '../../response';
import { decodeJWT, extractJWT } from '../../helpers';

const { REACTION_CREATED, REACTION_UPDATED, REACTION_DELETED } = reactionSuccess;
const { REACTION_OPERATION_FAIL } = reactionFail;

export const reactionController = async(req:Request, res:Response) => {
    try {
        const { post_id, type } = req.body;

        let from = req.body.from;

        if(!from) {
            const { id } = decodeJWT(extractJWT(req));
            from = id;
        }

        const existingReaction = await Reaction.findOne({ post_id, from });
        const exisitingPost = await Post.findById(post_id);
        
        if(!existingReaction) {
            const reactionObj: any = { from, post_id, type };
            const newReaction = await Reaction.create(reactionObj);
            
            exisitingPost?.reactions.push({ reactionId: newReaction._id })
            await exisitingPost?.save();
            
            return successResponseHandler(res, REACTION_CREATED ,`You ${type} the post`);
        }

        if(existingReaction.type !== type) {
            existingReaction.type = type;
            await existingReaction.save();
            return successResponseHandler(res, REACTION_UPDATED, `You ${type} the post`);
        }

        const index: any = exisitingPost?.reactions.findIndex((obj:any) => obj.reactionId === existingReaction._id)
        exisitingPost?.reactions.splice(index, 1);
        await exisitingPost?.save();
        await existingReaction.delete();
        return successResponseHandler(res, REACTION_DELETED, '');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, REACTION_OPERATION_FAIL, error.message, 304);
    }
}