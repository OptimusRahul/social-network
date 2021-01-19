import { Request, Response, NextFunction } from 'express';

import { decodeJWT, extractJWT } from '../../helpers'
import { errorResponseHandler } from '../../utils';
import { authMiddleWareError } from '../../response/errors';
import User from '../../models/userModel';

const { 
    UNAUTHORIZED_USER, 
    UNAUTHORIZED_TOKEN, 
    PASSWORD_CHANGED_LOGIN_AGAIN,
    USER_LOGGED_IN } = authMiddleWareError;


const verifyUserState = async(decoded: any, error: string, res: Response, next: NextFunction) => {
    const { id, iat } = decoded;
    let currentUser;
    try {
        currentUser = await User.findById(id);

        if(!currentUser) {
            return errorResponseHandler(res, error);
        }

        if(currentUser?.changedPasswordAfter(iat)) {
            return errorResponseHandler(res, PASSWORD_CHANGED_LOGIN_AGAIN);
        }        
    } catch(error) {
        const { message } = JSON.parse(JSON.stringify(error));
        return errorResponseHandler(res, message);
    }

    res.locals.user = currentUser;
    res.locals.id = id;
    res.locals.decoded = decoded;
    next();
} 

const checkUserAuthentication = (type: string, decoded: any, res: Response, next: NextFunction) => {
    switch(type) {
        case 'protect':
            verifyUserState(decoded, UNAUTHORIZED_TOKEN, res, next);
            break;
        default:
            verifyUserState(decoded, USER_LOGGED_IN, res, next);
            break;
    }
}

export const protect = async(req: Request, res: Response, next: NextFunction) => {
    const decoded = decodeJWT(extractJWT(req));
    checkUserAuthentication('protect', decoded, res, next);
}

export const isLoggedIn = async(req: Request, res: Response, next: NextFunction) => {
    const { cookies: { jwt } } = req;

    if(jwt) {
        const decoded = decodeJWT(jwt);
        checkUserAuthentication('', decoded, res, next);
    } else {
        return errorResponseHandler(res, UNAUTHORIZED_USER);
    }
}