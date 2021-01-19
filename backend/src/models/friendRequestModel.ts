import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';

import { IFriendsRequest } from '../types'
import { friendRequest } from '../config'

const { SENT, RECEIVED } = friendRequest;

const friendsRequestSchema: Schema<IFriendsRequest> = new Schema({
    from: {
        type: ObjectID,
        ref: 'user',
        required: true,
    },
    to: {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: [SENT, RECEIVED],
        default: SENT
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FriendRequest = model<IFriendsRequest>('friendRequests', friendsRequestSchema);

export default FriendRequest;