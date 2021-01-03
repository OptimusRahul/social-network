import express from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware';
import { getFriendRequest, sendFriendRequest, deleteFriendRequest, acceptFriendRequest } from '../controller/friendRequestController';

const friendRequestRouter = express.Router();

friendRequestRouter.use(isLoggedIn);

friendRequestRouter.get('/get', getFriendRequest);
friendRequestRouter.post('/send', sendFriendRequest);
friendRequestRouter.delete('/delete', deleteFriendRequest);
friendRequestRouter.post('/accept', acceptFriendRequest);

export { friendRequestRouter };