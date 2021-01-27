import { Response } from 'express';

export const responseHandler = (res: Response, message:string = '', data: any, statusCode: number = 200 ) => {
    res.status(statusCode).json({ status: 'success', message, data });
}

export const successResponseHandler = (res: Response, message:string = '', data: any, statusCode: number = 200 ) => {
    res.status(statusCode).json({ status: 'success', message, data });
}

export const errorResponseHandler = (res: Response, message:string = '', statusCode: number = 400 ) => {
    res.status(statusCode).json({ status: 'error', message });
}