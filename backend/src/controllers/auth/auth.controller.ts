import { Request, Response } from 'express';
import { createHash } from 'crypto';

import { User } from '../../models';
import { jwtConfig } from '../../config';
import { IUser } from '../../types'
import { decodeJWT, extractJWT, signToken } from '../../helpers';
import { successResponseHandler, errorResponseHandler, catchAsyncController } from '../../utils';
import { authError, authSuccess } from '../../response'

const { INCORRECT_PASSWORD, DUPLICATE_EMAIL, INVALID_USER, TOKEN_EXPIRED, REGISTRATION_FAILURE, NO_LOGGED_IN_USER } = authError;
const { REGISTRATION_SUCCESSFUL, LOGIN_SUCESS, LOGOUT_SUCCESS, PASSWORD_CHANGED_SUCCESS, PASSWORD_UPDATE_SUCCESS } = authSuccess;
const { JWT_COOKIE_EXPIRES_IN } = jwtConfig;

// Create and Send Token
const createSendToken = (user: Pick<IUser, 'id' | 'password'>, status: string, req: Request, res: Response) => {
    const { id } = user;
    const token = signToken(id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now().valueOf() + <any>JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: req.secure,
    });

    const responseObj = { token, id }
    return successResponseHandler(res, status, responseObj);
}

// Signup
export const signUp = catchAsyncController(async (req: Request, res: Response) => {
    const { body, body: { email } } = req;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return errorResponseHandler(res, DUPLICATE_EMAIL, '');
    }
    try {
        await User.create(body);
        return successResponseHandler(res, REGISTRATION_SUCCESSFUL, '');
    } catch (error) {
        console.log(error.message);
        return errorResponseHandler(res, REGISTRATION_FAILURE, error.message);
    }
});

// Login
export const login = async (req: Request, res: Response) => {
    const { body: { email, password } } = req;

    const existingUser = await User.findOne({ email }).select('password');

    if (!existingUser || !(await existingUser.comparePassword(password))) {
        return errorResponseHandler(res, INCORRECT_PASSWORD, 401);
    }

    existingUser.active = true;
    await existingUser.save();

    const userObj = {
        id: existingUser._id,
        password: existingUser.password
    }
    createSendToken(userObj, LOGIN_SUCESS, req, res);
}

// Logout
export const logout = async (req: Request, res: Response) => {

    if(!req.cookies.jwt) {
        return errorResponseHandler(res, NO_LOGGED_IN_USER, '');
    }

    const { id } = decodeJWT(extractJWT(req));

    await User.findByIdAndUpdate(id, { active: false });

    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    const responseObj = { token: null, msg: LOGOUT_SUCCESS};
    return successResponseHandler(res, LOGOUT_SUCCESS, responseObj);
}

// Forgot Password
export const fogotPassword = async (req: Request, res: Response) => {
    const { body: { email } } = req;
    
    const user = await User.findOne({ email });
    if (!user) {
        return errorResponseHandler(res, INVALID_USER, '', 204)
    }

    const resetToken = user?.createPasswordResetToken();
    await user?.save({ validateBeforeSave: false });

    return successResponseHandler(res, resetToken, '')
}

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
    const { body: { password }, params: { token } } = req;

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return errorResponseHandler(res, TOKEN_EXPIRED, '')
    }

    user.password = password;
    user.passwordResetToken = '';
    user.passwordResetExpires = -999999999999999;
    await user.save();
    return  successResponseHandler(res, PASSWORD_CHANGED_SUCCESS, '');
}

// Update Password
export const updatePassword = async (req: Request, res: Response) => {
    const { body: { currentPassword, password } } = req;

    const { id } = decodeJWT(extractJWT(req));     
    const existingUser = await User?.findById(id).select('+password');
    
    if(!await existingUser?.comparePassword(currentPassword)) {
        return errorResponseHandler(res, INCORRECT_PASSWORD, '');
    }

    if(!existingUser) {
        return errorResponseHandler(res, INVALID_USER, '');
    }

    existingUser.password = password;
    existingUser.passwordChangedAt = new Date();
    await existingUser?.save();

    const userObj = {
        id: existingUser._id,
        password: existingUser.password,
    }

    createSendToken(userObj, PASSWORD_UPDATE_SUCCESS, req, res);
}