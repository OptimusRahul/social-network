import { Router } from 'express';

import { isLoggedIn, verifyRequest, verifyAcceptFriendRequest, validationMiddleware } from '../../middlewares';
import { getRecievedFriendRequest, getSentFriendRequest, sendFriendRequest, deleteFriendRequest, acceptFriendRequest } from '../../controllers';
import { friendRequestSchema } from '../../helpers';

const { sendfriendRequestSchema, acceptFriendRequestSchema, deleteFriendRequestSchema } = friendRequestSchema;

const friendRequestRouter = Router();

friendRequestRouter.use(isLoggedIn);
friendRequestRouter.get('/get/sent', getSentFriendRequest);
friendRequestRouter.get('/get/received', getRecievedFriendRequest);
friendRequestRouter.post('/send', validationMiddleware(sendfriendRequestSchema), verifyRequest, sendFriendRequest);
friendRequestRouter.delete('/delete', validationMiddleware(deleteFriendRequestSchema), deleteFriendRequest);
friendRequestRouter.post('/accept', validationMiddleware(acceptFriendRequestSchema), verifyAcceptFriendRequest, acceptFriendRequest);

export { friendRequestRouter };