import { Request, Response } from 'express';

import { FriendRequest, Notification, User } from '../../models';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { friendRequestSuccess, userError, authError } from '../../response';
import { notification } from '../../config'
import { createNotification } from '../';
import { decodeJWT, extractJWT } from '../../helpers';

const { 
    INVALID_USER
} = userError;

const { 
    UNAUTHORIZED_ERROR, 
    INVALID_ID 
} = authError;

const { 
    FRIEND_REQUEST_SENT_SUCCESS, 
    FRIEND_REQUEST_DELETE_SUCCESS, 
    FRIEND_REQUEST_RECEIVED_LIST, 
    FRIEND_REQUEST_SENT_LIST, 
    FRIEND_REQUEST_ACCEPT_SUCCESS 
} = friendRequestSuccess;

const { 
    FRIEND_REQUEST_RECEIVED, 
    FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, 
    FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER 
} = notification;

// Send Friend Request
export const sendFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    const { to } = req.body;
    try {
        const createObj: any = { from: id, to };
        await FriendRequest.create(createObj);
        createNotification(req, { to: req.body.to, from: res.locals.id, type: FRIEND_REQUEST_RECEIVED}, res);
        successResponseHandler(res, FRIEND_REQUEST_SENT_SUCCESS, '');
    } catch(error) {
        console.log(error.message);
        return errorResponseHandler(res, error.message);
    }
}

// Delete Friend Request
export const deleteFriendRequest = async(req: Request, res: Response) => {
    try {
        const { id } = res.locals;
        const existingFriendRequest = await FriendRequest.findById(req.body.id);
        if(!existingFriendRequest) {
            return errorResponseHandler(res, INVALID_ID);
        }

        const requestFrom = existingFriendRequest.from.toString();
        const requestTo = existingFriendRequest.to.toString();
        if(requestFrom !== id && requestTo !== id) {
            return errorResponseHandler(res, UNAUTHORIZED_ERROR);
        }

        await existingFriendRequest.delete();
        successResponseHandler(res, FRIEND_REQUEST_DELETE_SUCCESS, '');        
    } catch(error) {
        console.log(error);
        return errorResponseHandler(res, error.message);
    }
}

// Get Recieved Friend Request
export const getRecievedFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;

    try {
        const friendRequests = await FriendRequest.find({ to: id }).populate('from');
        successResponseHandler(res, FRIEND_REQUEST_RECEIVED_LIST ,friendRequests);
    }catch(error) {
        console.log(error);
        return errorResponseHandler(res, error.message);
    }
}

// Get Sent Friend Request
export const getSentFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;

    try {
        const friendRequests = await FriendRequest.find({ from: id }).populate('to');
        return successResponseHandler(res, FRIEND_REQUEST_SENT_LIST, friendRequests);
    }catch(error) {
        console.log(error);
        return errorResponseHandler(res, error.message);
    }
}

// Accept Friend Request
export const acceptFriendRequest = async(req: Request, res: Response) => {
    const { locals: { friendRequest } } = res;

    try {
        const { id } = decodeJWT(extractJWT(req));
        const { to, from } = friendRequest;

        const user = await User.findById(id);
        const friend = await User.findById(from);
        const sentTo = await User.findById(to);

        if(!user || !friend || !sentTo) {
            console.log('!user || !friend || !sentTo');
            return errorResponseHandler(res, INVALID_USER);
        }

        if(user.id === friend.id) {
            console.log('user.id === friend.id');
            return errorResponseHandler(res, `Relax ${sentTo.fullName} will accept your request soon`);
        }

        const user_id: any = user._id;
        const friend_id: any = friend._id;

        user?.friends.push({friendId: friend_id});
        friend?.friends.push({friendId: user_id});

        user.save();
        friend.save();

        friendRequest.delete();

        await Notification.findOneAndDelete({ to: user_id, from: friend_id, notification: FRIEND_REQUEST_RECEIVED });
        createNotification(req, { to: user_id, from: friend_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER }, res);
        createNotification(req, { to: friend_id, from: user_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER}, res);

        return successResponseHandler(res, FRIEND_REQUEST_ACCEPT_SUCCESS, '');

    } catch(error) {
        console.log('======>', error);
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message);
    }
}