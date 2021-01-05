enum Gender {
    Male = 0,
    Female = 1
}

export interface IUser {
    id: string
    email: string
    password: string
    personalDetails: {
        firstName: string
        lastName: string
        photo: string
        gender: Gender
        DOB: Date
        location: Object

    }
    friends: Array<object>
    createdAt: Date
    passwordChangedAt: Date
    passwordResetToken: string
    passwordResetExpires: number
}