import { Request, Response } from 'express';
import validator from 'validator';
import { createHash } from 'crypto';

import { jwtConfig } from '../config';
import User from '../models/userModel';
import { IUser } from '../types'
import { authController } from '../response/errors/index';
import { signToken } from '../helpers';
import { successResponseHandler, errorResponseHandler } from '../utils';

const {
    ENTER_ALL_FIELDS_WARNING,
    INCORRECT_PASSWORD,
    INVALID_EMAIL,
    INVALID_USER,
    PASSWORD_MISMATCH,
    TOKEN_EXPIRED } = authController;

const { JWT_COOKIE_EXPIRES_IN } = jwtConfig;

// Create and Send Token
const createSendToken = (user: Pick<IUser, 'id' | 'password'>, statusCode: number, req: any, res: any) => {
    const { id } = user;
    const token = signToken(id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now().valueOf() + <any>JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure,
        credentials: 'include'
    });

    const responseObj = { token, id }
    successResponseHandler(res, responseObj);
}

// Signup
export const signUp = async (req: Request, res: Response) => {
    const { body,
        body: { email, password, passwordConfirm,
            personalDetails: { firstName, lastName, gender } } } = req;
    let errors: Array<object> = [];

    if (!email || !password || !passwordConfirm || !firstName || !lastName || !gender) {
        errors.push({ msg: ENTER_ALL_FIELDS_WARNING });
    }

    if(password !== passwordConfirm) {
        errors.push({ msg: PASSWORD_MISMATCH })
    }

    if (errors.length > 0) {
        return errorResponseHandler(res, errors);
    } else {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.push({ msg: 'Email already exists' });
            return errorResponseHandler(res, errors);
        } else {
            try {
                await User.create(body);
                const responseObj = { msg: 'User Registered Successfully' }
                return successResponseHandler(res, responseObj);
            } catch (error) {
                return errorResponseHandler(res, error.message);
            }
        }
    }
}

// Login
export const login = async (req: Request, res: Response) => {
    const { body: { email, password } } = req;

    let errors = [];
    if (!email || !password) {
        errors.push({ msg: ENTER_ALL_FIELDS_WARNING });
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        const existingUser = await User.findOne({ email }).select('password');

        if (!existingUser || !(await existingUser.comparePassword(password))) {
            return errorResponseHandler(res, INCORRECT_PASSWORD, 401);
        } else {
            const userObj = {
                id: existingUser._id,
                password: existingUser.password
            }
            createSendToken(userObj, 200, req, res);
        }
    }
}

// Logout
export const logout = async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    const responseObj = { token: null, msg: 'User Logged Out Successfully' };
    return successResponseHandler(res, responseObj);
}

// Forgot Password
export const fogotPassword = async (req: Request, res: Response) => {
    const { body: { email } } = req;
    if (!email || !validator.isEmail(email)) {
        return errorResponseHandler(res, INVALID_EMAIL);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return errorResponseHandler(res, INVALID_USER)
    }

    const resetToken = user?.createPasswordResetToken();
    await user?.save({ validateBeforeSave: false });

    return successResponseHandler(res, resetToken)
}

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
    const { body: { password, passwordConfirm } } = req;

    if(password !== passwordConfirm) {
        return errorResponseHandler(res, PASSWORD_MISMATCH);
    }

    const hashedToken = createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return errorResponseHandler(res, TOKEN_EXPIRED)
    }

    user.password = password;
    user.passwordResetToken = '';
    user.passwordResetExpires = -999999999999999;
    await user.save();
    return  successResponseHandler(res, 'password changed successfully');
}

// Update Password
export const updatePassword = async (req: Request, res: Response) => {
    const { body: { currentPassword, password, passwordConfirm } } = req;

    if(!currentPassword || !password || !passwordConfirm) {
        return errorResponseHandler(res, ENTER_ALL_FIELDS_WARNING);
    }

    if(password !== passwordConfirm) {
        return errorResponseHandler(res, PASSWORD_MISMATCH);
    }

    const { user: { id } } = <any>req;
    const user = await User?.findById(id).select('+password');
    
    console.log(await user?.comparePassword(currentPassword));
    if(!await user?.comparePassword(currentPassword)) {
        return errorResponseHandler(res, INCORRECT_PASSWORD);
    }

    if(!user) {
        return errorResponseHandler(res, INVALID_USER);
    }

    user.password = password;
    user.passwordChangedAt = new Date(Date.now());
    await user?.save();

    return successResponseHandler(res, 'Password Updated Successfully');
}