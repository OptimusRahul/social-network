import { Request, Response } from 'express';

import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';
import Notification from '../models/notificationModel';
import { decodeJWT, extractJWT } from '../helpers';
import { errorResponseHandler, successResponseHandler } from '../utils';
import { friendRequestController, authController } from '../response/errors';
import { notification } from '../config'
import { createNotificationController, updateNotificationController } from './notificationController';

const { INVALID_FRIEND_REQUEST } = friendRequestController;
const { INVALID_USER } = authController;
const { FRIEND_REQUEST_RECEIVED, FRIEND_REQUEST_ACCEPT, FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER } = notification;

export const sendFriendRequest = async(req: Request, res: Response) => {
    // const { body: { to } } = req;
    // const { id } = decodeJWT(extractJWT(req));

    // if(id === to) {
    //     errorResponseHandler(res, INVALID_FRIEND_REQUEST)
    // }

    try {
        // const createObj: any = { from: id, to };
        // await FriendRequest.create(createObj);
        // createNotificationController(req, { to, from: id, type: FRIEND_REQUEST_RECEIVED}, res);
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

export const getRecievedFriendRequest = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));

    try {
        const friendRequests = await FriendRequest.find({ to: id }).populate('from');
        successResponseHandler(res, friendRequests);
    }catch(error) {
        console.log(error);
    }
}

export const getSentFriendRequest = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));

    try {
        const friendRequests = await FriendRequest.find({ from: id }).populate('to');
        successResponseHandler(res, friendRequests);
    }catch(error) {
        console.log(error);
    }
}

export const acceptFriendRequest = async(req: Request, res: Response) => {
    const { friend, user, request_id, friendRequest } = res.locals
    // const { body: { request_id } } = req;
    // const { id } = decodeJWT(extractJWT(req));

    try {
        const user_id: any = user._id;
        const friend_id: any = friend._id;

        user?.friends.push(friend_id);
        friend?.friends.push(user_id);

        user.save();
        friend.save();

        friendRequest.delete();

        const existingNotificaton = await Notification.findOne({ to: user_id, from: friend_id, notification: FRIEND_REQUEST_RECEIVED });
        // console.log('----> ',existingNotificaton);
        await existingNotificaton?.delete();
        await createNotificationController(req, { to: user_id, from: friend_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER }, res);
        await createNotificationController(req, { to: friend_id, from: user_id, type: FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER}, res);

        successResponseHandler(res, 'User accepted the friend Request');

    } catch(error) {
        console.log(error)
    }
}