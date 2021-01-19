import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';

import { jwtConfig } from '../../config/index';

class Token {

    constructor() {
        
    }
    
    generateToken = () => {

    }
    
    extractToken = (id: string) => {
        return sign({ id }, JWT_SEC)
    }

    verifyToken = () => {

    }

}