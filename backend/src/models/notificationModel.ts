import { ObjectID } from 'mongodb';
import { model, Schema } from 'mongoose';

import User from './userModel';
import { notification } from '../config';
import { notificationService } from '../services/notifications/notifications';
import { INotification } from '../types'

const { 
    FRIEND_REQUEST_ACCEPT, 
    FRIEND_REQUEST_RECEIVED, 
    BIRTHDAY_NOTIFICATION, 
    FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER, 
    FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER } = notification;

const notificationSchema = new Schema({
    to: {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    from: {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    notification:{
        type: String,
        enum: [
            FRIEND_REQUEST_RECEIVED, 
            FRIEND_REQUEST_ACCEPT, 
            BIRTHDAY_NOTIFICATION,
            FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER,
            FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER
        ],
    },
    body: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// DB Middlewares
notificationSchema.pre<INotification>('save', async function(next) {
    const user = await User.findById(this.from);
    this.body = notificationService(this.notification, { name: user?.fullName })
    next();
});

const Notification = model<INotification>('notification', notificationSchema);

export default Notification;