import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';
import { authController, friendRequestController } from '../response/errors';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { decodeJWT, extractJWT } from '../helpers';

const  { INVALID_USER } = authController;
const { INVALID_FRIEND_REQUEST, FRIEND_REQUEST_NOT_FOUND } = friendRequestController;

export const verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { body: { to } } = req;
    const { id } =  decodeJWT(extractJWT(req));

    try {
        if(id === to) {
            return errorResponseHandler(res, INVALID_FRIEND_REQUEST);
        }

        const user = await User.findById(to);
        if(!user) {
            return errorResponseHandler(res, INVALID_USER)
        }

        user.friends && user.friends.forEach(id => {
            console.log(id);
        })

        const existingRequest = await FriendRequest.findOne({ $or: [ 
            { from: { $eq: to } },
            { to: { $eq: to } }
         ] });
         
        if(existingRequest){
            return successResponseHandler(res, 'Request Already Exists');
        }

        res.locals.id = id;

    } catch(error) {
        console.log(error);
    }

    next();
}

export const verifyAcceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { body: { request_id } } = req;
    const { id } = decodeJWT(extractJWT(req));

    try {
        const friendRequest = await FriendRequest.findOne({ _id: request_id });

        if(!friendRequest) {
            return errorResponseHandler(res, FRIEND_REQUEST_NOT_FOUND);
        }

        const { to, from } = friendRequest;

        const user = await User.findById(id);
        const friend = await User.findById(from); 
        const sentTo = await User.findById(to);

        if(!user || !friend || !sentTo) {
            return errorResponseHandler(res, INVALID_USER);
        }

        if(user.id === friend.id) {
            return errorResponseHandler(res, `Relax ${sentTo.fullName} will accept your request soon`);
        }

        res.locals.friend = friend;
        res.locals.currentUser = user;
        res.locals.friendRequest = friendRequest;
        res.locals.request_id = request_id
        next();
    }catch(error) {
        console.log(error);
    }

    next();
}