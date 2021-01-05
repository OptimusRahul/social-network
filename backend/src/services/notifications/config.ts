import { getMonth, getDayOfWeek, getDateExtension } from '../../utils'

export const friendRequestNotification = (friendData: any) => {
    const { name } = friendData;
    return `${name} sent you friend request.`
}

export const friendRequestAcceptNotification = (friendData: any) => {
    const { name } = friendData;
    return `${name} and You are now friends`
}

export const birthdayNotification = (friendData: any) => {
    const { date, name } = friendData;
    const currentDate = Date.now();
    const eventDate = new Date(date);
    const formatDate = ` ${getDayOfWeek(eventDate.getDay())} ${getMonth(eventDate.getMonth())} ${eventDate.getDate()}`

    switch(date) {
        case eventDate.getTime() < currentDate:
            return `${name} had birthday on ${formatDate}`
        case eventDate.getTime() === currentDate:
            return `${name} is having birthday today! Send a wish to make them feel special`
        default: return `${name} has birthday on ${formatDate}`
    }
}