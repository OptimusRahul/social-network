import { config } from 'dotenv';

config();

if(!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    process.exit(1);
}

export const dbConfig = { 
    DATABASE: process.env.DATABASE,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD
};