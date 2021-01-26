import { Document } from 'mongoose';

export interface INotification extends Document {
    id: string
    from: string
    to: string,
    notification: string
    body: string
}