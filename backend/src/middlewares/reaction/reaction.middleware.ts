import { Request, Response, NextFunction } from 'express';
import { decodeJWT, extractJWT } from '../../helpers';
import { errorResponseHandler } from '../../utils';

export const reactionMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const { id } = decodeJWT(extractJWT(req));
    if(req.body.from) {
        if(req.body.from !== id) {
            return errorResponseHandler(res, `You're not authorized to perform this action`);
        }
    }
    next();
}