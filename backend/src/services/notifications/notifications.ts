import { notification } from '../../config'
import { friendRequestNotification, 
    friendRequestAcceptNotificationReciever, 
    friendRequestAcceptNotificationSender, 
    birthdayNotification } from './config';

const { FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER, FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, FRIEND_REQUEST_RECEIVED, BIRTHDAY_NOTIFICATION, INVALID_NOTIFICATION } = notification;

export const notificationService = (type: string, notificationData: any) => {
    switch(type) {
        case FRIEND_REQUEST_RECEIVED: return friendRequestNotification(notificationData);
        case FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER: return friendRequestAcceptNotificationReciever(notificationData);
        case FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER: return friendRequestAcceptNotificationSender(notificationData);
        case BIRTHDAY_NOTIFICATION: return birthdayNotification(notificationData);
        default: return INVALID_NOTIFICATION;
    }
}