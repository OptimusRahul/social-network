import { config } from 'dotenv';

config();

if(!process.env.JWT_SECRET || process.env.JWT_EXPIRES_IN || process.env.JWT_COOKIE_EXPIRES_IN){
    process.exit(1);
}

export const jwtConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN
}