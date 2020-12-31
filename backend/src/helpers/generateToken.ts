import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const signToken = (id: string) => {
    if(!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN){
        process.exit(1);
    }
    return jwt.sign({ id },process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}