import { Schema, model, Document } from 'mongoose';

const friendsRequestSchema = new Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true
    },
    createdNow: {
        type: Date,
        default: Date.now
    }
});

export interface IFriendsRequest extends Document {
    from: string,
    to: string,
    createdAt: Date
}

const FriendRequest = model<IFriendsRequest>('friendRequest', friendsRequestSchema);

export default FriendRequest;