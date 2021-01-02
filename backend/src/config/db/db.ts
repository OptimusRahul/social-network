import { config } from 'dotenv';

config();

const { env: { DATABASE, DATABASE_PASSWORD } } = process;

if(!DATABASE || !DATABASE_PASSWORD) {
    process.exit(1);
}

export const dbConfig = { 
    DATABASE,
    DATABASE_PASSWORD
};