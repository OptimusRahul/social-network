import { Request, Response } from 'express';

import { FriendRequest, Notification, User } from '../../models';
import { errorResponseHandler, successResponseHandler } from '../../utils';
import { friendRequestControllerError, authControllerError } from '../../response/errors';
import { notification } from '../../config'
import { createNotification } from '../';
import { decodeJWT, extractJWT } from '../../helpers';

const { INVALID_USER } = authControllerError;
const { FRIEND_REQUEST_RECEIVED, FRIEND_REQUEST_ACCEPT, FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER } = notification;

// Send Friend Request
export const sendFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    const { to } = req.body;
    try {
        const createObj: any = { from: id, to };
        await FriendRequest.create(createObj);
        createNotification(req, { to: req.body.to, from: res.locals.id, type: FRIEND_REQUEST_RECEIVED}, res);
        successResponseHandler(res, { msg: 'Request sent successfully' });
    } catch(error) {
        console.log(error);
    }
}

// Delete Friend Request
export const deleteFriendRequest = async(req: Request, res: Response) => {
    try {
        const { id } = res.locals;
        const existingFriendRequest = await FriendRequest.findById(req.body.id);
        if(!existingFriendRequest) {
            return errorResponseHandler(res, 'INVALID ID');
        }

        const requestFrom = existingFriendRequest.from.toString();
        const requestTo = existingFriendRequest.to.toString();
        if(requestFrom !== id && requestTo !== id) {
            return errorResponseHandler(res, 'You are authorized to perform this action');
        }

        await existingFriendRequest.delete();
        successResponseHandler(res, 'Request Deleted Successfully');        
    } catch(error) {
        console.log(error);
    }
}

// Get Recieved Friend Request
export const getRecievedFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;

    try {
        const friendRequests = await FriendRequest.find({ to: id }).populate('from');
        successResponseHandler(res, friendRequests);
    }catch(error) {
        console.log(error);
    }
}

// Get Sent Friend Request
export const getSentFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;

    try {
        const friendRequests = await FriendRequest.find({ from: id }).populate('to');
        successResponseHandler(res, friendRequests);
    }catch(error) {
        console.log(error);
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

        return successResponseHandler(res, 'User accepted the friend Request');

    } catch(error) {
        console.log('======>', error);
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message);
    }
}