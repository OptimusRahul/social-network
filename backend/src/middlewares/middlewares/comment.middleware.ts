import { Request, Response, NextFunction } from 'express';

export const verifyComment = (req: Request, res:Response, next:NextFunction) => {
    const { body: { comment_id, post_id } } = req;
}