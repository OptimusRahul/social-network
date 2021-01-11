export { signToken } from './token/generateToken';
export { decodeJWT } from './token/verifyToken';
export { extractJWT } from './token/extractToken';

export { authSchema, friendRequestSchema, notificationSchema, postSchema, commentSchema } from './joi/joi.schema';