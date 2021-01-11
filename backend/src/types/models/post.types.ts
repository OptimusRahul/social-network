import { Document } from 'mongoose';

export interface IPost extends Document {
    id: string
    from: string
    to: string
    commentId: Array<object>
    scope: string
    reactions: Array<object>
    createdAt: Date
}