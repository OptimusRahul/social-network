import { Request, Response } from 'express';
import { decodeJWT, extractJWT } from '../helpers';

import Notification from '../models/notificationModel';
import { successResponseHandler } from '../utils';

export const createNotificationController = async(req: Request, data: any, res: Response) => {
    const { to, from, type } = data;
    try {
        const notificationObj: any = { to, from, notification: type };
        await Notification.create(notificationObj);
        console.log('Notification creeated');
    } catch(error) {
        console.log(error);
    }
}

export const updateNotificationController = async(req:Request, data: any, res: Response) => {
    const { notification_id, type } = data;
    try { 
        await Notification.findOneAndUpdate({ _id: notification_id, notification: type });
    }catch(error) {
        console.log(error);
    }
}

export const getNotificationController = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));
    try {
        const notification = await Notification.find({ to: id });
        successResponseHandler(res, notification);
    } catch(error) {
        console.log(error);
    }
}