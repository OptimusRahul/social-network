import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';

import { post, reaction } from '../config';
import { IPost } from '../types'

const { PUBLIC_POST, PRIVATE_POST } = post;
const { LIKE, LOVE, SAD, HAPPY, ANGRY } = reaction;

//  Me -> Wall -> from : id, post, createdAt, scope
//  Me -> friend -> Wall -> from: id, to: user_id, post, createdAt, scope ||
//                          from : user_id, to: id, post, createdAt, scope


const postSchema: Schema<IPost> = new Schema({
    from: {
        type: ObjectID,
        ref: 'user',
        required: true,
    },
    to: {
        type: ObjectID,
        ref: 'user',
    },
    post: {
        type: String
    },
    scope: {
        type: String,
        enum: [PUBLIC_POST, PRIVATE_POST],
        default: PUBLIC_POST
    },
    reactions:[{
        from: {
            type: ObjectID,
            ref: 'user',
            required: true
        },
        reaction: {
            type: String,
            enum: [LIKE, LOVE, HAPPY, SAD, ANGRY],
            required: true
        }
    }],
    commentId: [{
        type: ObjectID,
        ref: 'comment',
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = model<IPost>('post', postSchema);

export default Post;