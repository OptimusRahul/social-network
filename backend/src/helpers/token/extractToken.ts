import { Request } from 'express';

export const extractJWT = (req: Request) => {
    let token: string = '';
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    return token;
}