import { Router } from 'express';

import { isLoggedIn, verifyRequest, verifyAcceptFriendRequest } from '../middlewares';
import { getRecievedFriendRequest, getSentFriendRequest, sendFriendRequest, deleteFriendRequest, acceptFriendRequest } from '../controller/friendRequestController';

const friendRequestRouter = Router();

friendRequestRouter.use(isLoggedIn);

friendRequestRouter.get('/get/sent', getSentFriendRequest);
friendRequestRouter.get('/get/received', getRecievedFriendRequest);
friendRequestRouter.post('/send', verifyRequest, sendFriendRequest);
friendRequestRouter.delete('/delete', deleteFriendRequest);
friendRequestRouter.post('/accept', verifyAcceptFriendRequest, acceptFriendRequest);

export { friendRequestRouter };