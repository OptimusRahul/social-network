import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../../config/index';

const { JWT_SECRET } = jwtConfig;

export const decodeJWT = (token: string) => {
    try {
        return <{ id: string, iat: number, exp: number }>verify(token, JWT_SECRET)
    } catch(error) {
        return error.message;
    }
}