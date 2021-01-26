import { Document } from 'mongoose';

export interface IReaction extends Document {
    id: string,
    from: string,
    post_id: string
    type: string
    createdAt: Date
}