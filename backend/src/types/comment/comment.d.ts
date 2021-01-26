import { Document } from 'mongoose';

export interface IComment extends Document {
    id: string,
    from: string,
    post_id: string
    body: string
    type: string
    createdAt: Date
}