import { Request, Response, NextFunction } from 'express';
import { decodeJWT, extractJWT } from '../../helpers';

import User from '../../models/userModel';
import { authControllerError } from '../../response/errors';
import { errorResponseHandler } from '../../utils';

const { INVALID_USER } = authControllerError;

export const verifyExisitngUser = async(req:Request, res:Response, next:NextFunction) => {
    const { id } = decodeJWT(extractJWT(req));
    const { locals: { data: { to } } } = res;
    try {
        const existingUser = await User.findById(to);
        if(!existingUser) {
            return errorResponseHandler(res, INVALID_USER);
        }

        const alreadyFriends = await User.findById(to).find({ friends: { $in: id } });

        if(alreadyFriends.length <= 0) {
            return errorResponseHandler(res, 'You both are not friends');
        }
    } catch(error) {
        console.log(error);
    }
    next();
}