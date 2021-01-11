import { Request, Response } from 'express';
import { decodeJWT, extractJWT } from '../helpers';

import Notification from '../models/notificationModel';
import { successResponseHandler } from '../utils';

// Create Notification
export const createNotification = async(req: Request, data: any, res: Response) => {
    const { to, from, type } = data;
    try {
        const notificationObj: any = { to, from, notification: type };
        await Notification.create(notificationObj);
        console.log('Notification creeated');
    } catch(error) {
        console.log(error);
    }
}

export const getNotification = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));
    try {
        const notification = await Notification.find({ to: id });
        successResponseHandler(res, notification);
    } catch(error) {
        console.log(error);
    }
}