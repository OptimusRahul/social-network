import { ObjectID } from 'mongodb';
import { Schema, model, ObjectId } from 'mongoose';

import { reaction } from '../config'

const { LIKE, LOVE, HAPPY, SAD, ANGRY } = reaction;

const reactionSchema = new Schema({
    from: {
        type: ObjectID,
        ref: 'user',
        required: true
    },
    post_id:{
        type: ObjectID,
        ref: 'post',
        required: true
    },
    type: {
        type: String,
        enum: [LIKE, LOVE, HAPPY, SAD, ANGRY],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Reaction = model('reactions', reactionSchema);

export default Reaction;