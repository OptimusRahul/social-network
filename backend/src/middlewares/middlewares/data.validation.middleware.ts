import { Request, Response, NextFunction } from 'express';
import { Schema } from '@hapi/joi';
import { errorResponseHandler } from '../../utils';

export const validationMiddleware = (schema: Schema) => {
    return (req: Request, res:Response, next: NextFunction) => {
        const { body } = req;
        const result = schema.validate(body);
        const { error, value } = result;
        if(error) {
            return errorResponseHandler(res, error?.details[0].message, 422);
        } else {
            res.locals.data = value;
            next();
        }
    }
}

export const paramsValidation = (schema: Schema) => {
    return (req:Request, res:Response, next:NextFunction) => {
        const { params: { id } } = req;
        const result = schema.validate(id);
        const { error, value } = result;
        

        if(error) {
            return errorResponseHandler(res, error?.details[0].message, 422);
        }
        res.locals.param = value;
        next();
    }
}