import { ObjectID } from 'mongodb';
import { model, Schema, Document } from 'mongoose';

const notificationSchema = new Schema({
    to: {
        type: ObjectID,
        required: true
    },
    from: {
        type: ObjectID,
        required: true
    },
    notification:{
        type: String,
        enum: ['TAGS', 'REQUEST_RECIEVED', 'REQUEST_ACCEPTED', 'BIRTHDAY'],
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface INotification extends Document {
    from: string
    to: string,
    notification: string,
    createdAt: Date
}

const Notification = model<INotification>('notification', notificationSchema);

export default Notification;