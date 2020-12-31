import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { errorResponseHandler } from '../utils';
import { authMiddleWare } from '../errors/middlewares/auth.middleware.errors';
import User from '../models/userModel';

const { UNAUTHORIZED_USER, UNAUTHORIZED_TOKEN, PASSWORD_CHANGED_LOGIN_AGAIN } = authMiddleWare;

config();

export const protect = async(req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token: string;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    } else {
        token = '';
    }

    if(!token) {
        return errorResponseHandler(res, UNAUTHORIZED_USER, 401);
    }

    // 2) Verification token
    if(!process.env.JWT_SECRET){
        process.exit(1);
    }

    const decoded = <{ id:string, iat:number, exp:number }>await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    console.log(decoded);

    // 3) Check if user still exists
    try{ 
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            console.log(UNAUTHORIZED_TOKEN);   
        }

        if(currentUser?.changedPasswordAfter(decoded.iat)) {
            console.log(PASSWORD_CHANGED_LOGIN_AGAIN);
        }

        req.user = currentUser || '';
        res.locals.user = currentUser;
    } catch(error) {
        console.log('====>', error);
    }
    next();
}

export const isLoggedIn = async(req: Request, res: Response, next: NextFunction) => {
    if(req.cookies.jwt) {
        try {

        } catch(err) {

        }
    }
}