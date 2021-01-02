import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../../config/index';

const { JWT_SECRET } = jwtConfig;

export const decodeJWT = (token: string) => <{ id: string, iat: number, exp: number }>verify(token, JWT_SECRET);