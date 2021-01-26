import { Request, Response } from 'express';

export const catchAsyncController = (fn: Function) => {
    return (req: Request, res: Response) => {
        fn(req, res).catch();
    }
}