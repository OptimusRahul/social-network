import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';
import { authController, friendRequestController, friendRequestMiddleware } from '../response/errors';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { decodeJWT, extractJWT } from '../helpers';
import { exit } from 'process';

const  { INVALID_USER } = authController;
const { INVALID_FRIEND_REQUEST, FRIEND_REQUEST_NOT_FOUND } = friendRequestController;
const { EXISTING_REQUEST, ALREADY_FRIENDS } = friendRequestMiddleware;

export const verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { body: { to } } = req;
    const { id } =  decodeJWT(extractJWT(req));

    try {
        if(id === to) {
            return errorResponseHandler(res, INVALID_FRIEND_REQUEST);
        }

        const user = await User.findById(to)
        if(!user) {
            return errorResponseHandler(res, INVALID_USER)
        }

        let alreadyFriends = false;

        user.friends.forEach(friend => {
            const friendID = JSON.stringify(friend).substring(1, JSON.stringify(friend).length-1);
            if(friendID === id) {
                alreadyFriends = true;
                // return alreadyFriends;
            }
        });

        if(alreadyFriends) {
            return errorResponseHandler(res, ALREADY_FRIENDS);
        }

        const existingRequest = await FriendRequest.findOne({ $or: [
            { from: { $eq: to } },
            { to: { $eq: to } }
         ] });

        if(existingRequest){
            return successResponseHandler(res, EXISTING_REQUEST);
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