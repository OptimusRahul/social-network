export const userDetails = (user: any) => {
    const { email, personalDetails: { firstName, lastName, photo = "", gender, DOB = "", location: { work = "", home = "" } } } = user;
    
    return {
        email,
        personalDetails: {
            firstName,
            lastName,
            photo,
            gender,
            DOB,
            location: {
                work,
                home
            }
        }
    }
}

export const updateUserData = (user: any, updatedData: any) => {
    const updatedUser = { ...user, ...updatedData };
    return userDetails(updatedUser);
}