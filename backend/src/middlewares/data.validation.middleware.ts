import { Request, Response, NextFunction } from 'express';
import { Schema } from '@hapi/joi';
import { errorResponseHandler } from '../utils';

export const validationMiddleware = (schema: Schema) => {
    return (req: Request, res:Response, next: NextFunction) => {
        const { body } = req;
        const result = schema.validate(body);
        const { error } = result;
        if(error) {
            return errorResponseHandler(res, error?.details[0].message, 422);
        } else {
            res.locals.data = result;
            next();
        }
    }
}

export const paramsValidation = (param: any) => {
    return (req:Request, res:Response, next:NextFunction) => {

    }
}