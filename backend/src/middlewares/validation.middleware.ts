import { Request, Response, NextFunction } from 'express';

export const verify = (req: Request, res: Response, next: NextFunction) => {

    const { body: { input }} = req

    let errors: Array<string> = [];

    for(const property in input) {
        if(input[property] === null || input[property] === undefined || input[property] === '') {
            errors.push(`${property} is empty or undefined`);
        }

        if(typeof input[property] === 'object') {
            
        }
    }

    next();
}