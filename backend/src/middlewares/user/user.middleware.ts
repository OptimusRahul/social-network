import { Request, Response, NextFunction } from 'express';
import { decodeJWT, extractJWT } from '../../helpers';

import { User } from '../../models';
import { authControllerError } from '../../response/errors';
import { errorResponseHandler } from '../../utils';

const { INVALID_USER } = authControllerError;

export const verifyExisitngFriends = async(req:Request, res:Response, next:NextFunction) => {
    const { id } = decodeJWT(extractJWT(req));
    const { locals: { data: { to } } } = res;
    try {
        if(req.body.to) {
            console.log('test', req.body.to);
            const existingUser = await User.findById(req.body.to);
            if(!existingUser) {
                return errorResponseHandler(res, INVALID_USER);
            }
            let alreadyFriends = false;
            console.log(existingUser.friends);
            existingUser.friends.map((friend: any) => {
                console.log(typeof(friend), ' ', typeof(id));
                if(friend.friendId.toString() === id) {
                    alreadyFriends = true;
                }    
                return alreadyFriends;
            })
            console.log(alreadyFriends);
            if(!alreadyFriends) {
                return errorResponseHandler(res, 'You both are not friends');
            }
        }
    } catch(error) {
        console.log(error);
    }
    next();
}