import { ObjectID } from 'mongodb';
import { Schema, model, ObjectId } from 'mongoose';

import { reaction } from '../config'
import { IReaction } from '../types';

const { LIKE, LOVE, HAPPY, SAD, ANGRY } = reaction;

const reactionSchema : Schema<IReaction> = new Schema({
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

const Reaction = model<IReaction>('reactions', reactionSchema);

export default Reaction;