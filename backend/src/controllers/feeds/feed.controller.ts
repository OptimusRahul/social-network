import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { User, Post } from '../../models';
import { decodeJWT, extractJWT } from '../../helpers';
import { errorResponseHandler, successResponseHandler } from '../../utils';

export const feedsController = async(req:Request, res:Response) => {
    try {
        const page:any = Number(req.query.page);
        const lim:any = Number(req.query.limit);

        console.log(page, lim, typeof page, typeof lim);

        if(!lim || !page || isNaN(page) || isNaN(lim)) {
            return errorResponseHandler(res, 'Invalid page or limit')
        }

        const pageNumber: number = Number(req.query.page) ?? 1;
        const limit:number = Number(req.query.limit) ?? 10;
        const skipData = (pageNumber - 1) * limit;
        const { id } = decodeJWT(extractJWT(req));
        const user = await User.findById(id);
        if(!user) {
            return errorResponseHandler(res, 'User does not exist');
        }

        const conditions: Array<{}> = [{ from: mongoose.Types.ObjectId(id)} , { to: mongoose.Types.ObjectId(id) }];

        user.friends.map((friend:any) => {
            const obj = { from: mongoose.Types.ObjectId(friend.friendId), scope: 'PUBLIC_POST' };
            conditions.push(obj);
        });

        const userPost = await Post.aggregate([
            { $match: {
                $and: [
                    { $or: conditions }
                ]
            }},
            { $sort: { 'createdAt': -1 } },
            { 
                $facet: {
                    metadata: [ { $count: "total" } ],
                    data: [ { $skip: skipData }, { $limit: limit } ]
                }
            }
        ])

        successResponseHandler(res, userPost);
    }catch(error) {

    } 
}


export const profileViewController = async(req:Request, res:Response) => {
    try{
        const { id } = decodeJWT(extractJWT(req));
        const { user_id } = req.params;

        const visitingUserProfile = await Post.aggregate([
            { $match: {
                $and : [{
                    $or: [
                        { from : mongoose.Types.ObjectId(id), to: mongoose.Types.ObjectId(user_id) },
                        { from : mongoose.Types.ObjectId(user_id), to: mongoose.Types.ObjectId(id) },
                        { from : mongoose.Types.ObjectId(user_id), scope: 'PUBLIC_POST' }
                    ]
                }]
            }},
            { $sort: { 'createdAt': -1 } }
        ])

        successResponseHandler(res, visitingUserProfile);
    }catch(error) {
    
    }
}