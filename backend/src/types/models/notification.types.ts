import { Document } from 'mongoose';

export interface INotification extends Document {
    from: string
    to: string,
    notification: string
    body: string
}