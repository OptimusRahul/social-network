import { Request, Response } from 'express';

import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';
import { decodeJWT, extractJWT } from '../helpers';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { friendRequestController, authController } from '../response/errors';

const { INVALID_FRIEND_REQUEST } = friendRequestController;
const { INVALID_USER } = authController;

export const sendFriendRequest = async(req: Request, res: Response) => {
    const { body: { to } } = req;
    const { id } = decodeJWT(extractJWT(req));

    if(id === to) {
        errorResponseHandler(res, INVALID_FRIEND_REQUEST)
    }

    try {
        const createObj: any = { from: id, to }; 
        await FriendRequest.create(createObj);
        successResponseHandler(res, { msg: 'Request sent successfully' });
    } catch(error) {
        console.log(error);
    }
}

export const deleteFriendRequest = async(req: Request, res: Response) => {
    const { body: { id } } = req;
    try {
        await FriendRequest.findByIdAndDelete(id);
        successResponseHandler(res, 'Request Deleted Successfully');        
    } catch(error) {
        console.log(error);
    }
}

export const getFriendRequest = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));

    try {
        const friendRequests = await FriendRequest.find({ from: id });
        successResponseHandler(res, friendRequests);
    }catch(error) {
        console.log(error);
    }
}

export const acceptFriendRequest = async(req: Request, res: Response) => {
    const { body: { friend_id } } = req;
    const { id } = decodeJWT(extractJWT(req));

    try {
        const user = await User.findById({ id });
        
        if(!user) {
            errorResponseHandler(res, INVALID_USER);
        }

        user?.friends.push(friend_id);

        await FriendRequest.findByIdAndDelete({ _id: friend_id });

        user?.save();

        successResponseHandler(res, 'User accepted the friend Request');

    } catch(error) {
        console.log(error)
    }
}