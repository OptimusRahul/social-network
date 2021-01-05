import { NextFunction, Request, Response } from 'express';

import User from '../models/userModel';
import FriendRequest from '../models/friendRequestModel';
import { authController } from '../response/errors';
import { errorResponseHandler, successResponseHandler } from '../utils';

const  { INVALID_USER } = authController;

export const verifyRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { body: { to }, originalUrl  } = req;
    console.log(req.route.path);
    try {
        const friend = await User.findById(to);
        if(!friend) {
            return errorResponseHandler(res, INVALID_USER)
        }

        const existingRequest = await FriendRequest.findOne({ $or: [ 
            { from: { $eq: to } },
            { to: { $eq: to } }
         ] });
         
        if(existingRequest){
            return successResponseHandler(res, 'Request Already Exists');
        }
    } catch(error) {
        console.log(error);
    }

    next();
}