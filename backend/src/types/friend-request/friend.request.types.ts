import { Document } from 'mongoose';

export interface IFriendsRequest extends Document{
    id: string
    from: string
    to: string
    status: string
    createdAt: Date
}