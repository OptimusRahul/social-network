import { Document } from 'mongoose';

export interface IFriendsRequest extends Document{
    from: string
    to: string
    status: string
    createdAt: Date
}