import { Schema, model, Document } from 'mongoose';
import { ObjectID } from 'mongodb';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash  } from 'crypto';

import { IUser } from '../../types'
import { userModel } from '../../response';

const { 
    FIRST_NAME_WARNING,
    EMAIL_WARNING,
    PASSWORD_WARNING,
    GENDER_WARNING
} = userModel;

const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: [true, EMAIL_WARNING],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, EMAIL_WARNING]
    },
    password: {
        type: String,
        required: [true, PASSWORD_WARNING],
        minlength: 8,
        select: false,
    },
    personalDetails: {
        firstName:  {
            type: String,
            required: [true, FIRST_NAME_WARNING]
        },
        lastName: {
            type: String
        },
        photo: {
            type: String
        },
        gender: {
            type: Number,
            enum: [0, 1],
            default: 0,
            required: [true, GENDER_WARNING]
        },
        DOB: {
           type: Date,
        },
        location: {
            work: {
                type: String,
            },
            home: {
                type: String
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    friends: [{
        friendId: { 
            type: ObjectID, 
            ref: 'user',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Number,
    active: {
        type: Boolean,
        default: false,
    }

});

export interface IUserBaseDocument extends IUser {
    fullName: string;
    getGender: string;
    comparePassword(this: IUserBaseDocument, newPassword: string): Promise<boolean>,
    checkExistingField(field: string, email: string): Promise<boolean>,
    changedPasswordAfter(this: IUserBaseDocument, JWTTimestamp: number): boolean,
    createPasswordResetToken(this: IUserBaseDocument): string
}

// DB Middlewares
userSchema.pre<IUserBaseDocument>('save', async function(next) {
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Virtuals
userSchema.virtual('fullName').get(function(this: IUser) {
    return `${this.personalDetails.firstName} ${this.personalDetails.lastName}`;
});

userSchema.virtual('getGender').get(function(this: IUser) {
    return this.personalDetails.gender ? 'Female' : 'Male' 
});

// Methods
userSchema.methods.comparePassword = async function(this: IUser, newPassword: string) {
    return await bcrypt.compare(newPassword, this.password)
}

userSchema.methods.changedPasswordAfter = function(this: IUser, JWTTimestamp: number) {
    if(this.passwordChangedAt) {
        const changeTimestamp = this.passwordChangedAt.getTime()/1000;
        return JWTTimestamp < changeTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(this: IUser) {
    const resetToken = randomBytes(32).toString('hex');
    this.passwordResetToken = createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

// Statics
userSchema.statics.checkExistingField = async function(field: string, value: string) {
    const checkField = await User.findOne({ [`${field}`]: value })
    return checkField;
}

const User = model<IUserBaseDocument>('user', userSchema);

export { User };