import { notification } from '../../config'
import { friendRequestNotification, friendRequestAcceptNotification, birthdayNotification } from './config';

const { FRIEND_REQUEST_ACCEPT, FRIEND_REQUEST_RECEIVED, BIRTHDAY_NOTIFICATION, INVALID_NOTIFICATION } = notification;

export const notificationService = (type: string, notificationData: any) => {
    switch(type) {
        case FRIEND_REQUEST_RECEIVED: return friendRequestNotification(notificationData);
        case FRIEND_REQUEST_ACCEPT: return friendRequestAcceptNotification(notificationData);
        case BIRTHDAY_NOTIFICATION: return birthdayNotification(notificationData);
        default: return INVALID_NOTIFICATION;
    }
}