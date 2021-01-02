import express from 'express';

import { isLoggedIn } from '../middlewares/authMiddleware';

const friendRequestRouter = express.Router();

friendRequestRouter.use(isLoggedIn);

friendRequestRouter.post('/sendFriendRequest', (req, res) => { res.send('sendFriendRequest Route') });
friendRequestRouter.get('/getFriendRequest', (req, res) => { res.send('getFriendRequest Route') });

export { friendRequestRouter };