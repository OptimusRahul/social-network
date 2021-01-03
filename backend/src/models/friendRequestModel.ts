import { ObjectID } from 'mongodb';
import { Schema, model, Document } from 'mongoose';

const friendsRequestSchema: Schema<IFriendsRequest> = new Schema({
    from: {
        type: ObjectID,
        required: true,
    },
    to: {
        type: ObjectID,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'rejected'],
        default: 'sent'
    },
    createdNow: {
        type: Date,
        default: Date.now
    }
});

export interface IFriendsRequest extends Document {
    from: string
    to: string
    status: string
    createdAt: Date
}

const FriendRequest = model<IFriendsRequest>('friendRequests', friendsRequestSchema);

export default FriendRequest;