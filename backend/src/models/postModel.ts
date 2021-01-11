import { ObjectID } from 'mongodb';
import { model, Schema } from 'mongoose';

import { post, reaction } from '../config'; 
import { IPost } from '../types'

const { PUBLIC_POST, PRIVATE_POST } = post;
const { LIKE, LOVE, SAD, HAPPY, ANGRY } = reaction;

const postSchema: Schema<IPost> = new Schema({
    // from : {
    //     type: ObjectID,
    //     ref: 'user',
    //     required: true
    // },
    // to : {
    //     type: ObjectID,
    //     ref: 'user',
    //     required: true,
    // },
    // post: {
    //     type: String
    // },
    // scope: {
    //     type: String,
    //     enum: [PUBLIC_POST, PRIVATE_POST],
    //     default: PUBLIC_POST
    // },
    // reactions:[{ 
    //     from: ObjectID,
    //     ref: 'user',
    //     enum: [LIKE, LOVE, HAPPY, SAD, ANGRY]
    // }],
    // comment_id: [{ 
    //     type: ObjectID, 
    //     ref: 'comment', 
    //     createdAt: {
    //         type: Date,
    //         default: Date.now
    // }}],
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Posts = model<IPost>('post', postSchema);

export default Posts;