import { Request, Response, NextFunction } from 'express';

import { decodeJWT, extractJWT } from '../helpers'
import { errorResponseHandler, successResponseHandler } from '../utils';
import { authSuccess } from '../response/success/middlewares/auth.middleware';
import { authMiddleWare } from '../response/errors';
import User from '../models/userModel';

const { 
    UNAUTHORIZED_USER, 
    UNAUTHORIZED_TOKEN, 
    PASSWORD_CHANGED_LOGIN_AGAIN,
    USER_LOGGED_IN } = authMiddleWare;
const { PASSWORD_CHANGED } = authSuccess;

export const protect = async(req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    const token = extractJWT(req);

    // 2) Verification token
    let currentUser;

    try{ 

        const decoded = decodeJWT(token);

        // 3) Check if user still exists
        currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return errorResponseHandler(res, UNAUTHORIZED_TOKEN);
        }

        if(currentUser?.changedPasswordAfter(decoded.iat)) {
            return errorResponseHandler(res, PASSWORD_CHANGED_LOGIN_AGAIN);
        }
    } catch(error) {
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message);
    }

    req.user = currentUser || '';
    res.locals.user = currentUser;

    next();
}

export const isLoggedIn = async(req: Request, res: Response, next: NextFunction) => {
    if(req.cookies.jwt) {
        const token = req.cookies.jwt;
        try {
            const decoded = decodeJWT(token);

            const currentUser = await User.findById(decoded.id);
            
            if(!currentUser) {
                return errorResponseHandler(res, USER_LOGGED_IN)
            }

            if(currentUser.changedPasswordAfter(decoded.iat)) {
                return successResponseHandler(res, PASSWORD_CHANGED_LOGIN_AGAIN);
            }

            res.locals.user = currentUser;
            return next();

        } catch(error) {
            const { message } = JSON.parse(JSON.stringify(error));
            return errorResponseHandler(res, message);
        }
    }
    next(errorResponseHandler(res, UNAUTHORIZED_USER));
}