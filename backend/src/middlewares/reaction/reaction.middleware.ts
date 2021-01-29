import { Request, Response, NextFunction } from 'express';

import { decodeJWT, extractJWT } from '../../helpers';
import { errorResponseHandler } from '../../utils';
import { authError } from '../../response';

const { 
    UNAUTHORIZED_ERROR
} = authError;

export const reactionMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const { id } = decodeJWT(extractJWT(req));
    if(req.body.from !== id) {
        return errorResponseHandler(res, UNAUTHORIZED_ERROR, '');
    }
    next();
}