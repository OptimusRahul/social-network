import { Request } from 'express';
import passport, { Strategy } from 'passport';
import { config } from 'dotenv';

import User from '../../models/user.model';

config();

const cookieExtractor = (req: Request) => {
    let token: string = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    } 

    return token;
}

const options = {
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['RS256'],
    passReqToCallback: true
}