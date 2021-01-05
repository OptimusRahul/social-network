const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Apr', 'Thu', 'Fri', 'Sat'];
const dateExtenstion = ['st', 'nd', 'rd', 'th'];

export const getMonth = (month: number) => months[month];

export const getDayOfWeek = (day: number) => dayOfWeek[day];

export const getDateExtension = (date: any) => {
    switch(date) {
        case (date === 1 || date === 21 || date === 31) : return dateExtenstion[0];
        case (date === 2 || date === 22) : return dateExtenstion[1];
        case (date === 3 || date === 23) : return dateExtenstion[2];
        default : return dateExtenstion[3];
    }
}