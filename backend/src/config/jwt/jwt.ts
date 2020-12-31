import { config } from 'dotenv';

config();

if(!process.env.JWT_SECRET){
    process.exit(1);
}

export const jwtConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
}