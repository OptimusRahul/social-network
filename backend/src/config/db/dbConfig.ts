import { config } from 'dotenv';

config();

if(!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    process.exit(1);
}

export const dbConfig = { db_uri: process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD) };