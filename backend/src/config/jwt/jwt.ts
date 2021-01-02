import { config } from 'dotenv';

config();

const { env: { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN  } } = process;

if(!JWT_SECRET || !JWT_EXPIRES_IN || !JWT_COOKIE_EXPIRES_IN){
    process.exit(1);
}

export const jwtConfig = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN
}