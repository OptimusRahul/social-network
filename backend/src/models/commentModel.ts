import { string } from 'joi';
import { ObjectID } from 'mongodb';
import { model, Schema } from 'mongoose'

const commentSchema = new Schema({ 
    from : {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    to: {
        type: ObjectID,
        ref: 'user',
    },
    postId: [{
        type: ObjectID,
        ref: 'post',
        required: true
    }],
    body: {
        type: String,
        minlength: 1
    },
    type: {
        type: String,
        enum: ['COMMENT', 'REPLY']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = model('comment', commentSchema);

export default Comment;