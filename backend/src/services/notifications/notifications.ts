import { notification } from '../../config'
import { 
    friendRequestNotification, 
    friendRequestAcceptNotificationReciever, 
    friendRequestAcceptNotificationSender, 
    birthdayNotification,
    reactionNotification,
    commentNotification,
    tagNotification
} from './config';

const { 
    FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER, 
    FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER, 
    FRIEND_REQUEST_RECEIVED, 
    BIRTHDAY_NOTIFICATION,
    REACTION_NOTIFICATION,
    COMMENT_NOTIFICATION,
    TAG_NOTIFICATION,
    INVALID_NOTIFICATION 
} = notification;

export const notificationService = (type: string, notificationData: any):string => {
    switch(type) {
        case FRIEND_REQUEST_RECEIVED: return friendRequestNotification(notificationData);
        case FRIEND_REQUEST_ACCEPT_SUCCESS_RECEIVER: return friendRequestAcceptNotificationReciever(notificationData);
        case FRIEND_REQUEST_ACCEPT_SUCCESS_SENDER: return friendRequestAcceptNotificationSender(notificationData);
        case BIRTHDAY_NOTIFICATION: return birthdayNotification(notificationData);
        case REACTION_NOTIFICATION: return reactionNotification(notificationData);
        case COMMENT_NOTIFICATION: return commentNotification(notificationData);
        case TAG_NOTIFICATION: return tagNotification(notificationData);
        default: return INVALID_NOTIFICATION;
    }
}