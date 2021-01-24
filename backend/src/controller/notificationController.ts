import { Request, Response } from 'express';
import { decodeJWT, extractJWT } from '../helpers';

import Notification from '../models/notificationModel';
import { successResponseHandler, errorResponseHandler } from '../utils';

// Create Notification
export const createNotification = async(req: Request, data: any, res: Response) => {
    const { to, from, type } = data;
    try {
        const notificationObj: any = { to, from, notification: type };
        await Notification.create(notificationObj);
        console.log('Notification creeated');
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export const getNotification = async(req: Request, res: Response) => {
    const { id } = decodeJWT(extractJWT(req));
    try {
        const notification = await Notification.find({ to: id });
        return successResponseHandler(res, notification);
    } catch(error) {
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message);
    }
}