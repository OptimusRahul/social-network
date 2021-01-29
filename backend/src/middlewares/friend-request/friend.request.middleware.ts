import { NextFunction, request, Request, Response } from 'express';

import { User, FriendRequest } from '../../models';
import { authError, friendRequestError } from '../../response';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { decodeJWT, extractJWT } from '../../helpers';

const { 
    INVALID_USER,
} = authError;

const { 
    INVALID_FRIEND_REQUEST, 
    FRIEND_REQUEST_NOT_FOUND,
    EXISTING_REQUEST,
    ALREADY_FRIENDS,
} = friendRequestError;

export const verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body: { to } } = req;
        const { id } =  decodeJWT(extractJWT(req));

        if(id === to) {
            return errorResponseHandler(res, INVALID_FRIEND_REQUEST, '');
        }        

        const existingUser = await User.findById(to).populate('friends');

        if(!existingUser) {
            return errorResponseHandler(res, INVALID_USER, '')
        }

        const user = await User.findById(id);

        let i = user?.friends.map((friend: any, index: number) => {
            console.log(friend.friendId.toString() === to);
            console.log(friend.friendId.toString(), ' ', to)
            if(friend.friendId.toString() === to) {
                console.log(index);
            }
            return index;
        });

        const index = user?.friends.findIndex((friend:any) => friend.friendId.toString() === to)


        if(index !== -1) {
            return errorResponseHandler(res, ALREADY_FRIENDS, '');
        }

        const existingRequest = await FriendRequest.findOne({ $or: [
            { from: { $eq: to } },
            { to: { $eq: to } }
         ] });

        if(existingRequest){
            return successResponseHandler(res, EXISTING_REQUEST, '');
        }

        res.locals.id = id;
        res.locals.to = to;

    } catch(error) {
        console.log(error);
        return errorResponseHandler(res, error.message, '');
    }

    next();
}

export const verifyAcceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const friendRequest = await FriendRequest.findById(req.body.request_id);

        if(!friendRequest) {
            return errorResponseHandler(res, FRIEND_REQUEST_NOT_FOUND, 201);
        }        
        res.locals.friendRequest = friendRequest;
    }catch(error) {
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message, '');
    }

    next();
}