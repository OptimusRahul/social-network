import { Request, Response } from 'express';

import FriendRequest from '../models/friendRequestModel';
import Notification from '../models/notificationModel';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { friendRequestControllerError, authControllerError } from '../response/errors';
import { notification } from '../config'
import { createNotification } from './notificationController';

const { INVALID_FRIEND_REQUEST } = friendRequestControllerError;
const { INVALID_USER } = authControllerError;
const { FRIEND_REQUEST_RECEIVED, FRIEND_REQUEST_ACCEPT, FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER } = notification;

// Send Friend Request
export const sendFriendRequest = async(req: Request, res: Response) => {
    // const { locals: { id, to } } = res;

    console.log('friend Request Contorleer')


    try {
        const createObj: any = { from: res.locals.id, to: req.body.to };
        await FriendRequest.create(createObj);
        createNotification(req, { to: req.body.to, from: res.locals.id, type: FRIEND_REQUEST_RECEIVED}, res);
        successResponseHandler(res, { msg: 'Request sent successfully' });
    } catch(error) {
        console.log(error);
    }
}

// Delete Friend Request
export const deleteFriendRequest = async(req: Request, res: Response) => {
    const { locals: { id } } = res;
    try {
        await FriendRequest.findByIdAndDelete(id);
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
    const { locals: { friend, user, friendRequest } } = res;

    try {
        const user_id: any = user._id;
        const friend_id: any = friend._id;

        user?.friends.push({friendId: friend_id});
        friend?.friends.push({friendId: user_id});

        user.save();
        friend.save();

        friendRequest.delete();

        const existingNotificaton = await Notification.findOne({ to: user_id, from: friend_id, notification: FRIEND_REQUEST_RECEIVED });
        await existingNotificaton?.delete();
        createNotification(req, { to: user_id, from: friend_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER }, res);
        createNotification(req, { to: friend_id, from: user_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER}, res);

        successResponseHandler(res, 'User accepted the friend Request');

    } catch(error) {
        console.log(error)
    }
}