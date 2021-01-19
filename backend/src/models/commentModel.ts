import { ObjectID } from 'mongodb';
import { Schema, model } from 'mongoose';

import { IComment } from '../types'

const commentSchema: Schema<IComment> = new Schema({ 
    from : {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    postId: {
        type: ObjectID,
        ref: 'post',
        required: true
    },
    body: {
        type: String,
        minlength: 1
    },
    type: {
        type: String,
        enum: ['COMMENT', 'REPLY'],
        default: 'COMMENT'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = model<IComment>('comments', commentSchema);

export default Comment;