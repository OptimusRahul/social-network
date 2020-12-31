import { Response } from 'express';

export const responseHandler = (res: Response, data: any, statusCode: number = 200 ) => {
    res.status(statusCode).json({ status: 'success', data });
}

export const successResponseHandler = (res: Response, data: any, statusCode: number = 200 ) => {
    res.status(statusCode).json({ status: 'success', data });
}

export const errorResponseHandler = (res: Response, data: any, statusCode: number = 400 ) => {
    res.status(statusCode).json({ status: 'error', data });
}

