import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt/jwt';

const { JWT_SECRET, JWT_EXPIRES_IN } = jwtConfig;

export const signToken = (id: string) => { 
    return jwt.sign({ id }, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN
    });
}